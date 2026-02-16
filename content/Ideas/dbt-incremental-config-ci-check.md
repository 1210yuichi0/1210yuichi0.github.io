---
title: dbt増分更新設定の自動チェックをCIに組み込む
tags:
  - アイデア
  - dbt
  - CI/CD
  - データエンジニアリング
  - BigQuery
date: 2026-02-16
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-16
  reviewed: false
---

## 概要

dbtのincremental modelにおいて、BigQueryの`copy_partitions`設定やincremental strategy（`insert_overwrite`）が適切に設定されているかをCIで自動チェックする仕組みを構築するアイデア。

## 背景・きっかけ

### 問題点

dbtのincremental modelを使用する際、以下のような設定ミスが発生しやすい：

1. **`incremental_strategy = 'insert_overwrite'`と`copy_partitions: true`の組み合わせ忘れ**
   - merge戦略を使ってしまい、大量データでフルスキャンが発生
   - コストと実行時間が膨大になる

2. **パーティション設定の不備**
   - static/dynamic/copying partitionsの選択ミス
   - WHERE句の記述漏れ

3. **増分ロジックのテスト不足**
   - CI環境では常にゼロからビルドされるため、増分動作のバグが本番まで見逃される

### きっかけ

Zennの記事「[dbt Incremental Model on BigQuery](https://zenn.dev/raksul_data/articles/dbt_incremental_model_on_bq)」で、copying partitions（`copy_partitions: true`）が時間的・経済的に最も効率的であると知った。しかし、この設定を手動で確認するのは漏れが発生しやすい。

## 詳細

### チェックすべき設定項目

#### 1. BigQuery Incremental Model の推奨設定

**最も推奨される構成：**

```yaml
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'insert_overwrite',
    partition_by = {
        'field': 'date_column',
        'data_type': 'date'
    },
    copy_partitions = true
) }}
```

**チェックポイント：**

- ✅ `materialized = 'incremental'`
- ✅ `incremental_strategy = 'insert_overwrite'`
- ✅ `copy_partitions = true` が設定されている
- ✅ `partition_by` が適切に設定されている
- ✅ WHERE句で増分対象を絞り込んでいる

#### 2. 3つのinsert_overwrite戦略の比較

| 戦略                   | partitions指定 | copy_partitions | コスト   | 設定複雑度 |
| ---------------------- | -------------- | --------------- | -------- | ---------- |
| Static Partitions      | 必要           | -               | 中       | 高         |
| Dynamic Partitions     | 不要           | -               | 高       | 低         |
| **Copying Partitions** | 不要           | **true**        | **最安** | **中**     |

**Copying Partitionsの利点：**

- Copy Table APIを使用（挿入コストゼロ）
- WHERE句で対象データを指定
- アトミックな更新（`WRITE_TRUNCATE`）
- 大規模データセットで最も効率的

### 実装アプローチ

#### アプローチ1: pre-commit-dbt（dbt-checkpoint）を活用

**ツール:**

- [pre-commit-dbt](https://github.com/dbt-checkpoint/dbt-checkpoint)（旧pre-commit-dbt）
- 20以上のdbt専用テストを提供

**実装例：**

`.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/dbt-checkpoint/dbt-checkpoint
    rev: v2.0.0
    hooks:
      # 基本的なdbtチェック
      - id: check-model-has-tests
      - id: check-model-has-description

      # カスタムフック：増分設定チェック
      - id: check-script-has-no-table-name
        name: Check Incremental Config
        entry: scripts/check_incremental_config.py
        language: python
        files: models/.*\.sql$
```

#### アプローチ2: カスタムPythonスクリプト

**`scripts/check_incremental_config.py`:**

```python
import re
import sys
from pathlib import Path

def check_incremental_config(file_path):
    """
    dbtモデルファイルの増分設定をチェック
    """
    with open(file_path, 'r') as f:
        content = f.read()

    # incremental materializedを検出
    if "materialized = 'incremental'" not in content:
        return True  # incremental modelでなければOK

    errors = []

    # insert_overwrite戦略のチェック
    if "incremental_strategy = 'insert_overwrite'" not in content:
        errors.append("⚠️  incremental_strategy = 'insert_overwrite' が未設定")

    # copy_partitionsのチェック
    if "incremental_strategy = 'insert_overwrite'" in content:
        if "copy_partitions" not in content:
            errors.append("⚠️  copy_partitions が未設定（推奨: true）")
        elif "copy_partitions = true" not in content:
            errors.append("⚠️  copy_partitions = true を推奨")

    # partition_byのチェック
    if "partition_by" not in content:
        errors.append("⚠️  partition_by が未設定")

    # WHERE句のチェック（増分条件）
    if not re.search(r"WHERE.*is_incremental", content, re.IGNORECASE):
        errors.append("⚠️  増分条件のWHERE句が見つかりません")

    if errors:
        print(f"\n❌ {file_path}")
        for error in errors:
            print(f"  {error}")
        return False

    return True

def main():
    files = sys.argv[1:]
    all_passed = True

    for file_path in files:
        if not check_incremental_config(file_path):
            all_passed = False

    if not all_passed:
        print("\n💡 修正方法:")
        print("  materialized = 'incremental',")
        print("  incremental_strategy = 'insert_overwrite',")
        print("  copy_partitions = true")
        sys.exit(1)

    print("✅ すべての増分設定チェックに合格しました")

if __name__ == "__main__":
    main()
```

#### アプローチ3: GitHub Actions CI統合

**`.github/workflows/dbt-check.yml`:**

```yaml
name: dbt Configuration Check

on:
  pull_request:
    paths:
      - "models/**/*.sql"

jobs:
  check-incremental-config:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install dbt-bigquery
          pip install pyyaml

      - name: Check Incremental Model Config
        run: |
          python scripts/check_incremental_config.py models/**/*.sql

      - name: dbt Parse (syntax check)
        run: dbt parse

      # dbt cloneを使った増分ロジックのテスト
      - name: Clone incremental models
        run: |
          dbt clone --select state:modified+,config.materialized:incremental,state:old

      - name: Build modified models
        run: dbt build --select state:modified+
```

### 高度な実装：増分ロジックのテスト

#### dbt cloneを使った実戦的テスト

公式推奨のベストプラクティス：

**問題点:**

- CI環境では増分モデルが常にゼロからビルドされる
- `is_incremental()` が常に `false` になる
- 本番の増分動作をテストできない

**解決策: dbt clone戦略**

```bash
# ステップ1: 本番の増分モデルをクローン
dbt clone --select state:modified+,config.materialized:incremental,state:old

# ステップ2: 増分ビルド実行
dbt build --select state:modified+
```

これにより、CI環境でも `is_incremental()` が `true` になり、実際の増分ロジックがテストされる。

#### 新ツール: dbt-incremental-ci (2026)

最新のソリューション：[dbt-incremental-ci](https://newsletter.ponder.co/p/incremental-ci-for-dbt-stop-rebuilding)

**特徴:**

- 本番の増分モデルとスナップショットをCIスキーマにコピー
- 実際の本番データに対してテスト
- 空のテーブルではなく、リアルなデータで検証

### チェックリスト

**設定チェック項目:**

- [ ] `materialized = 'incremental'` が設定されている
- [ ] `incremental_strategy = 'insert_overwrite'` が設定されている
- [ ] `copy_partitions = true` が設定されている（BigQuery）
- [ ] `partition_by` が適切に設定されている
- [ ] 増分条件のWHERE句が存在する
- [ ] `on_schema_change` が設定されている（推奨）

**テスト項目:**

- [ ] dbt parseが成功する
- [ ] dbt cloneで増分モデルをクローンできる
- [ ] 増分ビルドが成功する
- [ ] フルリフレッシュとの結果比較（定期的に）
- [ ] 重複データのチェック
- [ ] NULL値のチェック

## 実現可能性・次のステップ

### Phase 1: 基本実装（1週間）

1. **カスタムチェックスクリプト作成**
   - `check_incremental_config.py` を実装
   - ローカルでテスト

2. **pre-commit統合**
   - `.pre-commit-config.yaml` に追加
   - チーム内で試験運用

### Phase 2: CI統合（2週間）

1. **GitHub Actions設定**
   - dbt-check.yml を作成
   - PRでの自動チェック

2. **dbt clone戦略の導入**
   - CI環境でのテスト改善
   - dbt-incremental-ciの評価

### Phase 3: 継続的改善（継続）

1. **チェック項目の拡充**
   - パフォーマンスメトリクスの収集
   - コスト分析の自動化

2. **ドキュメント整備**
   - ベストプラクティスの文書化
   - チーム内勉強会

### 技術スタック

- **言語:** Python 3.11+
- **CI/CD:** GitHub Actions
- **dbt:** dbt-bigquery
- **pre-commit:** pre-commit-dbt (dbt-checkpoint)
- **オプション:** dbt-incremental-ci

### 期待される効果

1. **コスト削減**
   - 不適切なmerge戦略の防止
   - フルスキャンの回避
   - 見積もり：30-50%のクエリコスト削減

2. **品質向上**
   - 設定ミスの早期発見
   - 増分ロジックのバグ検出
   - 本番障害の防止

3. **開発効率化**
   - レビュー時間の短縮
   - ドキュメントとしての役割
   - 新メンバーのオンボーディング支援

## 参考リンク

### 記事・ブログ

- [dbt Incremental Model on BigQuery (Zenn)](https://zenn.dev/raksul_data/articles/dbt_incremental_model_on_bq) - copying partitionsの詳細解説
- [BigQuery ingestion-time partitioning and partition copy with dbt (dbt Blog)](https://docs.getdbt.com/blog/bigquery-ingestion-time-partitioning-and-partition-copy-with-dbt)
- [Incremental CI for dbt: Stop Rebuilding Everything From Scratch](https://newsletter.ponder.co/p/incremental-ci-for-dbt-stop-rebuilding)

### 公式ドキュメント

- [Incremental models in-depth (dbt)](https://docs.getdbt.com/best-practices/materializations/4-incremental-models)
- [Clone incremental models as the first step of your CI job (dbt)](https://docs.getdbt.com/best-practices/clone-incremental-models)
- [BigQuery configurations (dbt)](https://docs.getdbt.com/reference/resource-configs/bigquery-configs)
- [About incremental strategy (dbt)](https://docs.getdbt.com/docs/build/incremental-strategy)

### ツール・リポジトリ

- [dbt-checkpoint (GitHub)](https://github.com/dbt-checkpoint/dbt-checkpoint) - 旧pre-commit-dbt
- [dbt-bigquery (GitHub)](https://github.com/dbt-labs/dbt-bigquery)
- [Enforcing rules at scale with pre-commit-dbt (dbt Blog)](https://docs.getdbt.com/blog/enforcing-rules-pre-commit-dbt)

### コミュニティ

- [Testing incremental models (dbt Community Forum)](https://discourse.getdbt.com/t/testing-incremental-models/1528)
- [BigQuery ingestion-time partitioning and partition copy with dbt (dbt Community Forum)](https://discourse.getdbt.com/t/bigquery-ingestion-time-partitioning-and-partition-copy-with-dbt/7237)

---

_作成日: 2026-02-16_
_更新日: 2026-02-16_
