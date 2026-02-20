---
title: "dbt Pre-commit Hook: SQLファイルにconfig()を書かせない検証"
date: 2026-02-20
tags: ["dbt", "pre-commit", "best-practices", "code-quality"]
categories: ["検証"]
draft: false
---

# dbt Pre-commit Hook 検証: no-config-in-sql

## TL;DR（要約）

dbtモデルのSQLファイルに`{{ config() }}`を書かせないpre-commitフックを実装・検証しました。

**結果**: ✅ 両テストケース（成功/失敗）とも期待通りに動作

**主な成果**:

- SQLファイルからconfigを排除し、YAMLに集約
- コミット前に自動チェック
- 明確なエラーメッセージで修正方法を提示

---

## なぜこのルールが必要か

### 問題: SQLファイルにconfigを書くと...

```sql
-- ❌ BAD: SQLロジックとメタデータが混在
{{ config(
    materialized='table',
    tags=['daily', 'critical'],
    partition_by={'field': 'order_date', 'data_type': 'date'}
) }}

select * from {{ ref('orders') }}
```

**デメリット:**

- SQLロジックとメタデータが混在
- 設定の一覧性が悪い
- YAMLとSQLで重複定義の可能性

### 解決策: YAMLファイルにconfigを集約

```yaml
# ✅ GOOD: schema.ymlに設定を集約
models:
  - name: orders
    config:
      materialized: table
      tags: ["daily", "critical"]
      partition_by:
        field: order_date
        data_type: date
```

**メリット:**

- 設定が一箇所に集約
- SQLはロジックに集中
- dbt docsとの一貫性

---

## 実装内容

### Pre-commit設定

**.pre-commit-config.yaml**

```yaml
repos:
  - repo: local
    hooks:
      - id: no-config-in-sql
        name: "❌ Config must be in YAML, not SQL"
        entry: scripts/check_no_config_in_sql.sh
        language: system
        pass_filenames: true
        files: 'models/.*\.sql$'
        stages: [commit]
```

### チェックスクリプト

**scripts/check_no_config_in_sql.sh**

```bash
#!/bin/bash
set -e

has_error=0

for file in "$@"; do
  if grep -E '\{\{[[:space:]]*config[[:space:]]*\(' "$file" >/dev/null 2>&1; then
    echo ""
    echo "❌ ERROR: config() found in: $file"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Config must be defined in schema.yml, not in SQL files."
    echo ""
    echo "Example schema.yml:"
    echo "  models:"
    echo "    - name: my_model"
    echo "      config:"
    echo "        materialized: table"
    echo "        tags: ['daily']"
    echo ""
    has_error=1
  fi
done

exit $has_error
```

---

## 検証結果

### テストケース1: 成功ケース（configなし）

**ファイル**: `models/test_without_config.sql`

```sql
-- This file has NO config() - should pass pre-commit check
select 1 as id, 'test' as name
```

**実行結果:**

```
❌ Config must be in YAML, not SQL.......................................Passed
```

✅ **PASSED**

### テストケース2: 失敗ケース（configあり）

**ファイル**: `models/test_with_config.sql`

```sql
{{ config(
    materialized='table',
    tags=['test']
) }}

select 1 as id, 'test' as name
```

**実行結果:**

```
❌ Config must be in YAML, not SQL.......................................Failed
- hook id: no-config-in-sql
- exit code: 1

❌ ERROR: config() found in: models/test_with_config.sql
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Config must be defined in schema.yml, not in SQL files.

Example schema.yml:
  models:
    - name: my_model
      config:
        materialized: table
        tags: ['daily']
```

❌ **FAILED** (意図通り)

---

## 検証結果サマリー

| テストケース | ファイル                | config()の有無 | 期待結果 | 実際の結果 | ステータス |
| ------------ | ----------------------- | -------------- | -------- | ---------- | ---------- |
| 成功ケース   | test_without_config.sql | なし           | PASS     | PASS       | ✅         |
| 失敗ケース   | test_with_config.sql    | あり           | FAIL     | FAIL       | ✅         |

**結論: 両テストケースとも期待通りに動作 ✅**

---

## 実運用での使い方

### 開発フロー

```bash
# 1. dbtモデルを編集
vim models/my_new_model.sql

# 2. configはschema.ymlに記述
vim models/schema.yml

# 3. コミット（pre-commitが自動実行）
git commit -m "Add new model"

# → SQLにconfig()があれば自動的にブロック
```

### エラー発生時の対処

```bash
# 1. SQLファイルからconfig()を削除
vim models/my_model.sql  # config()ブロックを削除

# 2. schema.ymlに移動
vim models/schema.yml
# models:
#   - name: my_model
#     config:
#       materialized: table

# 3. 再度コミット
git commit -m "Add new model"
```

---

## ベストプラクティス

### ✅ 推奨パターン

**SQL**: ロジックのみ

```sql
-- models/daily_sales.sql
with orders as (
  select * from {{ ref('orders') }}
  where order_date >= current_date() - 7
)
select
  order_date,
  sum(amount) as total_sales
from orders
group by order_date
```

**YAML**: 設定をまとめる

```yaml
# models/schema.yml
models:
  - name: daily_sales
    description: "過去7日間の日次売上集計"
    config:
      materialized: table
      partition_by:
        field: order_date
        data_type: date
      tags: ["daily", "sales"]
```

---

## CI/CDへの統合

### GitHub Actions例

```yaml
name: pre-commit

on:
  pull_request:
    paths:
      - "models/**"

jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: "3.12"
      - name: Run pre-commit
        run: |
          pip install pre-commit
          pre-commit run --all-files
```

---

## まとめ

### 達成されたこと

✅ **実装完了**

- pre-commitフックの作成
- チェックスクリプトの実装
- テストケースの検証（成功/失敗）

✅ **このフックが保証すること**

- SQLファイルに`{{ config() }}`が書かれない
- コミット前の自動チェック
- チーム全体でのルール統一

### 保証されないこと

❌ YAML内のconfig設定の妥当性
❌ 実行時のエラー検出
❌ 既存ファイルの自動修正

### 次のステップ

1. 既存ファイルの移行: SQLからYAMLへconfigを移動
2. チーム周知: pre-commitの使い方をドキュメント化
3. CI統合: GitHub ActionsやGitLab CIでも実行

---

## 参考資料

- [dbt公式ドキュメント: Configuring models](https://docs.getdbt.com/reference/model-configs)
- [pre-commit公式ドキュメント](https://pre-commit.com/)

---

**検証環境**: jaffle_shop_duckdb (BigQuery設定)
**最終更新**: 2026-02-20
