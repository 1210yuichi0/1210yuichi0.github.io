---
title: "dbt Pre-commit Hook: BigQuery Incremental設定不備を自動検出"
date: 2026-02-20
tags: ["dbt", "bigquery", "pre-commit", "incremental", "data-engineering"]
categories: ["検証"]
draft: false
---

## TL;DR（要約）

BigQueryの`materialized: incremental`モデルで、**実行時エラーになる設定不備をコミット前に自動検出**するpre-commitフックを実装・検証しました。

**結果**: ✅ すべてのエラーケース（merge/insert_overwrite/デフォルト戦略）を正しく検出

**主な成果**:

- merge戦略で`unique_key`未指定 → ERROR検出
- insert_overwrite戦略で`partition_by`未指定 → ERROR検出
- `on_schema_change`未指定 → WARNING表示（推奨設定を提案）

---

## なぜこのチェックが必要か

### よくある問題: 実行時まで気づかない設定ミス

dbtのincremental materialization機能は強力ですが、**設定ミスがあっても実行時まで気づかない**という問題があります。

#### ケース1: merge戦略でunique_key未指定

```yaml
# ❌ BAD: YAMLファイルは問題なく見えるが...
models:
  - name: daily_sales
    config:
      materialized: incremental
      incremental_strategy: merge
      # unique_key がない
```

**実行時のエラー:**

```
Compilation Error in model daily_sales
  unique_key is required for merge strategy
```

#### ケース2: insert_overwrite戦略でpartition_by未指定

```yaml
# ❌ BAD: パーティション未指定では動作しない
models:
  - name: order_summary
    config:
      materialized: incremental
      incremental_strategy: insert_overwrite
      # partition_by がない
```

#### ケース3: デフォルト戦略の認識不足

```yaml
# ❌ BAD: incremental_strategy未指定 → デフォルト'merge' → unique_key必須
models:
  - name: customer_orders
    config:
      materialized: incremental
      # incremental_strategy 未指定 → デフォルトmerge
      # unique_key がない → エラー
```

---

## BigQuery Incremental戦略の基礎

### サポートされている戦略

| 戦略                 | 説明                         | 必須設定       | 推奨ケース                   |
| -------------------- | ---------------------------- | -------------- | ---------------------------- |
| **merge**            | 既存レコードを更新、新規挿入 | `unique_key`   | レコード単位の更新が必要     |
| **insert_overwrite** | パーティション全体を上書き   | `partition_by` | 日次バッチ処理（最速・最安） |
| **microbatch**       | 小さいバッチに分割して処理   | 別途設定       | 大量データの段階的処理       |

### デフォルト戦略

- BigQueryのデフォルトは **`merge`**
- `incremental_strategy`未指定 → 自動的に`merge`として扱われる
- **重要**: `merge`には`unique_key`が必須

---

## 実装内容

### Pre-commit設定

**.pre-commit-config.yaml**

```yaml
repos:
  - repo: local
    hooks:
      - id: check-incremental-config
        name: "🔍 Validate BigQuery incremental config"
        entry: python3 scripts/check_incremental_config.py
        language: system
        pass_filenames: true
        files: 'models/.*\.(yml|yaml)$'
        stages: [commit]
```

### チェックスクリプト

**scripts/check_incremental_config.py** (Pythonスクリプト)

**チェック内容:**

1. ✅ **merge戦略のチェック**
   - `incremental_strategy: merge` → `unique_key`が必須
   - デフォルト戦略（未指定） → `unique_key`が必須

2. ✅ **insert_overwrite戦略のチェック**
   - `incremental_strategy: insert_overwrite` → `partition_by`が必須

3. ⚠️ **on_schema_changeの警告**
   - `on_schema_change`未指定 → 警告（推奨設定を提案）

---

## 検証結果

### テスト1: 成功ケース

**YAML:**

```yaml
models:
  # ✅ merge + unique_key
  - name: test_merge_success
    config:
      materialized: incremental
      incremental_strategy: merge
      unique_key: customer_id
      on_schema_change: fail

  # ✅ insert_overwrite + partition_by
  - name: test_insert_overwrite_success
    config:
      materialized: incremental
      incremental_strategy: insert_overwrite
      partition_by:
        field: order_date
        data_type: date
```

**実行結果:**

```
🔍 Validate BigQuery incremental config..................................Passed
```

✅ **PASSED**

### テスト2: 失敗ケース

**YAML:**

```yaml
models:
  # ❌ merge WITHOUT unique_key
  - name: test_merge_error
    config:
      materialized: incremental
      incremental_strategy: merge
      # unique_key missing

  # ❌ insert_overwrite WITHOUT partition_by
  - name: test_insert_overwrite_error
    config:
      materialized: incremental
      incremental_strategy: insert_overwrite
      # partition_by missing
```

**実行結果:**

```
🔍 Validate BigQuery incremental config..................................Failed
- hook id: check-incremental-config
- exit code: 1

❌ ERRORS (Incremental Config):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 File: models/test_incremental_errors.yml
📦 Model: test_merge_error
   incremental_strategy: 'merge' requires 'unique_key'
  Add to config:
    unique_key: 'id'  # or ['col1', 'col2'] for composite key

📄 File: models/test_incremental_errors.yml
📦 Model: test_insert_overwrite_error
   incremental_strategy: 'insert_overwrite' requires 'partition_by'
  Add to config:
    partition_by:
      field: order_date
      data_type: date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 References:
  - https://docs.getdbt.com/reference/resource-configs/bigquery-configs
  - https://docs.getdbt.com/docs/build/incremental-strategy
```

❌ **FAILED** (意図通り)

---

## 検証結果サマリー

| テストケース           | 戦略             | 必須設定         | 検出結果  | ステータス |
| ---------------------- | ---------------- | ---------------- | --------- | ---------- |
| merge成功              | merge            | unique_key: ✅   | PASS      | ✅         |
| insert_overwrite成功   | insert_overwrite | partition_by: ✅ | PASS      | ✅         |
| mergeエラー            | merge            | unique_key: ❌   | ERROR検出 | ✅         |
| insert_overwriteエラー | insert_overwrite | partition_by: ❌ | ERROR検出 | ✅         |
| デフォルト戦略エラー   | (未指定→merge)   | unique_key: ❌   | ERROR検出 | ✅         |

**結論: すべてのテストケースが期待通りに動作 ✅**

---

## エラーメッセージと修正方法

### エラー1: merge戦略でunique_key未指定

**エラーメッセージ:**

```
❌ ERROR: incremental_strategy: 'merge' requires 'unique_key'
  Add to config:
    unique_key: 'id'  # or ['col1', 'col2'] for composite key
```

**修正方法:**

```yaml
config:
  materialized: incremental
  incremental_strategy: merge
  unique_key: customer_id # ← 追加
```

### エラー2: insert_overwrite戦略でpartition_by未指定

**エラーメッセージ:**

```
❌ ERROR: incremental_strategy: 'insert_overwrite' requires 'partition_by'
  Add to config:
    partition_by:
      field: order_date
      data_type: date
```

**修正方法:**

```yaml
config:
  materialized: incremental
  incremental_strategy: insert_overwrite
  partition_by: # ← 追加
    field: order_date
    data_type: date
```

---

## ベストプラクティス

### ✅ 推奨: 戦略別の設定パターン

#### パターン1: merge戦略（レコード更新が必要）

```yaml
# ✅ GOOD: merge戦略の正しい設定
models:
  - name: customer_orders
    config:
      materialized: incremental
      incremental_strategy: merge
      unique_key: customer_id # 必須
      on_schema_change: fail # 推奨
```

**ユースケース:** 顧客マスタ、在庫残高、ステータス変更

#### パターン2: insert_overwrite戦略（日次バッチ）

```yaml
# ✅ GOOD: insert_overwrite戦略の正しい設定
models:
  - name: daily_sales_summary
    config:
      materialized: incremental
      incremental_strategy: insert_overwrite
      partition_by: # 必須
        field: order_date
        data_type: date
      cluster_by: ["store_id", "category"] # オプション（推奨）
      on_schema_change: fail # 推奨
```

**ユースケース:** 日次売上集計、ログデータ集約

**メリット:**

- **最速**: パーティション全体を上書き（UPDATE不要）
- **最安**: スキャン量が最小
- **シンプル**: unique_key不要

---

## 実運用での使い方

### 開発フロー

```bash
# 1. incrementalモデルのYAMLを編集
vim models/schema.yml

# 2. コミット（pre-commitが自動実行）
git add models/schema.yml
git commit -m "Add daily_sales incremental model"

# → 設定不備があれば自動的にブロック
```

### エラー発生時の対処

```bash
# エラーメッセージを確認
# ❌ ERROR: incremental_strategy: 'merge' requires 'unique_key'

# 1. schema.ymlを修正
vim models/schema.yml
# config:
#   unique_key: customer_id  # ← 追加

# 2. 再度コミット
git commit -m "Add unique_key to incremental model"
# → ✅ PASS
```

---

## まとめ

### 達成されたこと

✅ **実装完了**

- BigQuery incremental設定検証スクリプト（Python）
- Pre-commitフックへの統合
- テストケース検証（成功/失敗/警告）

✅ **このフックが保証すること**

- merge戦略で`unique_key`が指定されている
- insert_overwrite戦略で`partition_by`が指定されている
- 設定不備をコミット前に検出

### 保証されないこと

❌ `unique_key`が実際のカラム名と一致するか
❌ `partition_by`のフィールドが存在するか
❌ 実行時のクエリエラー

### 次のステップ

1. 既存モデルの監査: 既存のincrementalモデルをチェック
2. チーム周知: pre-commitフックの使い方をドキュメント化
3. CI統合: GitHub ActionsやGitLab CIでも実行

---

## 参考資料

- [Configure incremental models | dbt Developer Hub](https://docs.getdbt.com/docs/build/incremental-models)
- [About incremental strategy | dbt Developer Hub](https://docs.getdbt.com/docs/build/incremental-strategy)
- [BigQuery configurations | dbt Developer Hub](https://docs.getdbt.com/reference/resource-configs/bigquery-configs)

---

**検証環境**: jaffle_shop_duckdb (BigQuery設定)
**最終更新**: 2026-02-20
