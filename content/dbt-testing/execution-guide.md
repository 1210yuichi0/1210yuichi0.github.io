---
title: "再実行ガイド"
date: 2026-02-17
tags: ["dbt", "bigquery", "setup", "execution", "verification"]
categories: ["ガイド"]
draft: false
description: "dbt + BigQuery検証プロジェクトを最初から再実行するための手順書。環境構築から全カテゴリの検証まで、すべてのコマンドを網羅。"
weight: 2
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---

このガイドでは、dbt + BigQueryの全設定項目検証を**最初から再現**するための手順を説明します。

---

## 📋 目次

1. [環境準備](#1-環境準備)
2. [プロジェクトセットアップ](#2-プロジェクトセットアップ)
3. [Category 1: プロジェクト基本設定](#3-category-1-プロジェクト基本設定)
4. [Category 2: BigQuery接続設定](#4-category-2-bigquery接続設定)
5. [Category 3: モデル設定](#5-category-3-モデル設定)
6. [Category 4: テスト設定](#6-category-4-テスト設定)
7. [Category 5: ドキュメント設定](#7-category-5-ドキュメント設定)
8. [Category 6: パフォーマンス最適化](#8-category-6-パフォーマンス最適化)
9. [Category 7: スナップショット設定](#9-category-7-スナップショット設定)
10. [Category 8: シード設定](#10-category-8-シード設定)
11. [Category 9: フック設定](#11-category-9-フック設定)
12. [Category 10: その他の設定](#12-category-10-その他の設定)
13. [ログとテーブルの確認](#13-ログとテーブルの確認)
14. [トラブルシューティング](#14-トラブルシューティング)

---

## 1. 環境準備

### 1.1 前提条件

- **OS**: macOS / Linux / Windows（WSL推奨）
- **Python**: 3.8以上
- **GCPプロジェクト**: BigQueryが有効化されていること
- **権限**: BigQuery Data Editor + BigQuery Job User

### 1.2 ソフトウェアのインストール

```bash
# Python仮想環境の作成
python3 -m venv .venv
source .venv/bin/activate  # Windowsの場合: .venv\Scripts\activate

# dbt-bigqueryのインストール
pip install dbt-bigquery==1.11.0

# バージョン確認
dbt --version
# 出力例:
# Core:
#   - installed: 1.11.5
#   - latest:    1.11.5 - Up to date!
# Plugins:
#   - bigquery: 1.11.0 - Up to date!
```

### 1.3 Google Cloud認証

**方法1: OAuth認証（ローカル開発推奨）**

```bash
# gcloud CLIのインストール（未インストールの場合）
# https://cloud.google.com/sdk/docs/install

# 認証
gcloud auth application-default login

# プロジェクトの設定
gcloud config set project your-gcp-project-id
```

**方法2: サービスアカウント認証（本番推奨）**

```bash
# サービスアカウントキーのダウンロード
# GCPコンソール > IAM > Service Accounts > Create Service Account
# - 権限: BigQuery Data Editor, BigQuery Job User
# - JSONキーを作成してダウンロード

# 環境変数に設定
export DBT_BIGQUERY_KEYFILE_JSON='{"type": "service_account", ...}'

# または、ファイルパスを設定
export DBT_BIGQUERY_KEYFILE=/path/to/your-sa-key.json
```

---

## 2. プロジェクトセットアップ

### 2.1 プロジェクトディレクトリ構造

```bash
# プロジェクトディレクトリに移動
cd /path/to/jaffle_shop_duckdb

# ディレクトリ構造の確認
tree -L 2
# 出力例:
# .
# ├── dbt_project.yml
# ├── profiles.yml
# ├── models/
# ├── tests/
# ├── seeds/
# ├── snapshots/
# ├── macros/
# └── docs/
```

### 2.2 profiles.ymlの設定

**ローカル開発用（OAuth認証）**:

```yaml
# profiles.yml
dbt:
  outputs:
    sandbox:
      type: bigquery
      method: oauth
      project: your-gcp-project-id
      dataset: dbt_sandbox
      location: asia-northeast1
      threads: 4
      priority: interactive
      job_execution_timeout_seconds: 600
      job_retries: 1

  target: sandbox
```

**本番用（サービスアカウント認証）**:

```yaml
dbt:
  outputs:
    prod:
      type: bigquery
      method: service-account-json
      project: your-gcp-project-id
      dataset: dbt_prod
      location: asia-northeast1
      threads: 16
      priority: batch
      job_execution_timeout_seconds: 3600
      job_retries: 1
      keyfile_json: "{{ env_var('DBT_BIGQUERY_KEYFILE_JSON') }}"

  target: prod
```

### 2.3 接続確認

```bash
# dbt debug で接続テスト
dbt debug --profiles-dir . --target sandbox

# 期待される出力:
# Configuration:
#   profiles.yml file [OK found and valid]
#   dbt_project.yml file [OK found and valid]
#
# Required dependencies:
#  - git [OK found]
#
# Connection:
#   method: oauth
#   database: your-gcp-project-id
#   schema: dbt_sandbox
#   location: asia-northeast1
#   priority: interactive
#   Connection test: [OK connection ok]
```

---

## 3. Category 1: プロジェクト基本設定

### 3.1 dbt_project.ymlの検証

```bash
# dbt compileでYAMLの構文チェック
dbt compile --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  Running with dbt=1.11.5
# 17:30:01  Found 10 models, 15 tests, 3 seeds
# 17:30:02  Concurrency: 4 threads (target='sandbox')
# 17:30:05  Completed successfully
```

### 3.2 検証項目

以下の設定項目を検証します：

- `name`: プロジェクト名
- `config-version`: 2（必須）
- `version`: プロジェクトバージョン
- `profile`: profiles.ymlとの連携
- `model-paths`: モデルの配置場所（デフォルト: `['models']`）
- `seed-paths`: シードの配置場所（デフォルト: `['seeds']`）
- `test-paths`: テストの配置場所（デフォルト: `['tests']`）
- `macro-paths`: マクロの配置場所（デフォルト: `['macros']`）
- `snapshot-paths`: スナップショットの配置場所（デフォルト: `['snapshots']`）
- `target-path`: コンパイル出力先（デフォルト: `'target'`）
- `clean-targets`: `dbt clean`の対象（デフォルト: `['target', 'dbt_packages']`）
- `require-dbt-version`: dbtバージョン制約
- `query-comment`: SQLコメント挿入
- `vars`: グローバル変数

**詳細**: [Category 1レポート](../dbt-connection/project-basic-config.md)

---

## 4. Category 2: BigQuery接続設定

### 4.1 認証方法の検証

**OAuth認証の確認**:

```bash
# OAuth認証で接続
dbt run --select stg_customers --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  Running with dbt=1.11.5
# 17:30:01  Found 1 model, 0 tests, 0 seeds
# 17:30:02  Concurrency: 4 threads (target='sandbox')
# 17:30:03  1 of 1 START sql view model dbt_sandbox.stg_customers ................... [RUN]
# 17:30:05  1 of 1 OK created sql view model dbt_sandbox.stg_customers .............. [CREATE VIEW in 2.0s]
```

### 4.2 オプション設定の検証

以下の設定を検証します：

- `priority`: interactive / batch
- `job_execution_timeout_seconds`: タイムアウト時間
- `job_retries`: リトライ回数
- `location`: データロケーション（asia-northeast1等）
- `maximum_bytes_billed`: コスト上限
- `threads`: 並列実行数

**詳細**: [Category 2レポート](../dbt-connection/bigquery-connection.md)

---

## 5. Category 3: モデル設定

### 5.1 データ準備

```bash
# Step 1: シードのロード
dbt seed --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  1 of 3 START seed file dbt_sandbox.raw_customers ........................ [RUN]
# 17:30:02  1 of 3 OK loaded seed file dbt_sandbox.raw_customers ..................... [INSERT 100 in 2.0s]
# 17:30:02  2 of 3 START seed file dbt_sandbox.raw_orders ............................ [RUN]
# 17:30:04  2 of 3 OK loaded seed file dbt_sandbox.raw_orders ........................ [INSERT 99 in 2.0s]
# 17:30:04  3 of 3 START seed file dbt_sandbox.raw_payments .......................... [RUN]
# 17:30:06  3 of 3 OK loaded seed file dbt_sandbox.raw_payments ...................... [INSERT 113 in 2.0s]

# Step 2: Stagingモデルのビルド
dbt run --select staging --profiles-dir . --target sandbox

# 出力例:
# 17:30:10  1 of 3 START sql view model dbt_sandbox.stg_customers .................... [RUN]
# 17:30:12  1 of 3 OK created sql view model dbt_sandbox.stg_customers ............... [CREATE VIEW in 2.0s]
# 17:30:12  2 of 3 START sql view model dbt_sandbox.stg_orders ....................... [RUN]
# 17:30:14  2 of 3 OK created sql view model dbt_sandbox.stg_orders .................. [CREATE VIEW in 2.0s]
# 17:30:14  3 of 3 START sql view model dbt_sandbox.stg_payments ..................... [RUN]
# 17:30:16  3 of 3 OK created sql view model dbt_sandbox.stg_payments ................ [CREATE VIEW in 2.0s]

# Step 3: Martsモデルのビルド
dbt run --select customers orders --profiles-dir . --target sandbox

# 出力例:
# 17:30:20  1 of 2 START sql table model dbt_sandbox.customers ....................... [RUN]
# 17:30:25  1 of 2 OK created sql table model dbt_sandbox.customers .................. [CREATE TABLE (100 rows) in 5.0s]
# 17:30:25  2 of 2 START sql table model dbt_sandbox.orders .......................... [RUN]
# 17:30:30  2 of 2 OK created sql table model dbt_sandbox.orders ..................... [CREATE TABLE (99 rows) in 5.0s]
```

### 5.2 検証モデルの実行

19個の検証モデルを実行します：

```bash
# マテリアライゼーションの検証（5種類）
dbt run --select mat_table_demo --profiles-dir . --target sandbox
dbt run --select mat_view_demo --profiles-dir . --target sandbox
dbt run --select mat_incremental_demo --profiles-dir . --target sandbox
dbt run --select mat_ephemeral_demo --profiles-dir . --target sandbox
dbt run --select mat_matview_demo --profiles-dir . --target sandbox

# パーティショニングの検証（6種類）
dbt run --select partition_date_demo --profiles-dir . --target sandbox
dbt run --select partition_timestamp_demo --profiles-dir . --target sandbox
dbt run --select partition_int_demo --profiles-dir . --target sandbox
dbt run --select partition_filter_required_demo --profiles-dir . --target sandbox
dbt run --select partition_expiration_demo --profiles-dir . --target sandbox

# クラスタリングの検証（3種類）
dbt run --select cluster_single_demo --profiles-dir . --target sandbox
dbt run --select cluster_multi_demo --profiles-dir . --target sandbox
dbt run --select cluster_part_demo --profiles-dir . --target sandbox

# 増分戦略の検証（3種類）
dbt run --select incr_merge_demo --profiles-dir . --target sandbox
dbt run --select incr_insert_overwrite_demo --profiles-dir . --target sandbox
dbt run --select incr_microbatch_demo --profiles-dir . --target sandbox

# その他の設定（2種類）
dbt run --select labels_demo --profiles-dir . --target sandbox
dbt run --select expiration_demo --profiles-dir . --target sandbox
```

**詳細**: [Category 3レポート](../dbt-models/models.md)

---

## 6. Category 4: テスト設定

### 6.1 Schema Testsの実行

```bash
# すべてのSchema Testsを実行
dbt test --select test_type:generic --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  1 of 8 START test unique_stg_customers_customer_id ....................... [RUN]
# 17:30:02  1 of 8 PASS unique_stg_customers_customer_id ............................. [PASS in 2.0s]
# 17:30:02  2 of 8 START test not_null_stg_customers_customer_id ..................... [RUN]
# 17:30:04  2 of 8 PASS not_null_stg_customers_customer_id ........................... [PASS in 2.0s]
# ...
# 17:30:20  Completed successfully
```

### 6.2 Singular Testsの実行

```bash
# Singular Testsを実行
dbt test --select test_type:singular --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  1 of 2 START test assert_positive_order_amount ........................... [RUN]
# 17:30:02  1 of 2 PASS assert_positive_order_amount ................................. [PASS in 2.0s]
# 17:30:02  2 of 2 START test assert_valid_order_status_transition ................... [RUN]
# 17:30:04  2 of 2 PASS assert_valid_order_status_transition ......................... [PASS in 2.0s]
```

### 6.3 Unit Testsの実行

```bash
# Unit Testsを実行（高速）
dbt test --select test_type:unit --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  1 of 10 START unit test customers::test_customer_aggregation ............. [RUN]
# 17:30:01  1 of 10 PASS unit test customers::test_customer_aggregation .............. [PASS in 1.0s]
# ...
# 17:30:15  Completed successfully
```

**詳細**: [Category 4レポート](../dbt-testing/testing-config.md)

---

## 7. Category 5: ドキュメント設定

### 7.1 dbt docsの生成

```bash
# ドキュメント生成
dbt docs generate --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  Running with dbt=1.11.5
# 17:30:01  Found 10 models, 15 tests, 3 seeds
# 17:30:05  Building catalog
# 17:30:10  Catalog written to target/catalog.json
# 17:30:10  Manifest written to target/manifest.json
```

### 7.2 dbt docsの表示

```bash
# ローカルサーバーを起動
dbt docs serve --profiles-dir . --port 8080

# ブラウザで開く
open http://localhost:8080
```

**詳細**: [Category 5レポート](../dbt-config/documentation-config.md)

---

## 8. Category 6: パフォーマンス最適化

### 6.1 スロット使用状況の確認

```bash
# BigQuery CLIでスロット使用状況を確認
bq ls -j -a -n 50 your-gcp-project-id

# dbt実行中のスロット監視
dbt run --select customers --profiles-dir . --target sandbox &
bq show -j $(bq ls -j -a -n 1 your-gcp-project-id | tail -n 1 | awk '{print $1}')
```

### 6.2 クエリパフォーマンスの測定

```bash
# --log-level debug でクエリ詳細を確認
dbt run --select customers --profiles-dir . --target sandbox --log-level debug

# 出力例（抜粋）:
# DEBUG: Executing SQL: CREATE TABLE `your-gcp-project-id.dbt_sandbox.customers` AS ...
# DEBUG: BigQuery adapter: Query complete, processed 5.2 MB in 3.2s
```

**詳細**: [Category 6レポート](../dbt-config/performance-optimization.md)

---

## 9. Category 7: スナップショット設定

### 9.1 スナップショットの作成

```bash
# 初回スナップショット
dbt snapshot --profiles-dir . --target sandbox

# 出力例:
# 17:30:00  1 of 1 START snapshot dbt_sandbox_snapshots.customers_snapshot .......... [RUN]
# 17:30:05  1 of 1 OK snapshotted dbt_sandbox_snapshots.customers_snapshot ........... [INSERT 100 in 5.0s]
```

### 9.2 データ変更後の再スナップショット

```bash
# データを変更（例: raw_customersを更新）
# その後、再度スナップショット実行
dbt snapshot --profiles-dir . --target sandbox

# 出力例:
# 17:35:00  1 of 1 START snapshot dbt_sandbox_snapshots.customers_snapshot .......... [RUN]
# 17:35:05  1 of 1 OK snapshotted dbt_sandbox_snapshots.customers_snapshot ........... [MERGE (5 inserted, 3 updated) in 5.0s]
```

**詳細**: [Category 7レポート](../dbt-performance/snapshot-config.md)

---

## 10. Category 8: シード設定

### 10.1 シードのロード（各種設定）

```bash
# 基本的なシードロード
dbt seed --profiles-dir . --target sandbox

# 特定のシードのみロード
dbt seed --select raw_customers --profiles-dir . --target sandbox

# full-refreshでの再ロード
dbt seed --full-refresh --profiles-dir . --target sandbox
```

**詳細**: [Category 8レポート](../dbt-config/seed-config.md)

---

## 11. Category 9: フック設定

### 11.1 フックの実行確認

```bash
# フック付きでdbt run実行
dbt run --profiles-dir . --target sandbox

# 出力例（on-run-startフックが実行される）:
# 17:30:00  Running with dbt=1.11.5
# 17:30:01  1 of 1 START hook: dbt.on-run-start.0 .................................... [RUN]
# 17:30:02  1 of 1 OK hook: dbt.on-run-start.0 ....................................... [OK in 1.0s]
# 17:30:02  1 of 10 START sql view model dbt_sandbox.stg_customers ................... [RUN]
# ...
# 17:30:50  1 of 1 START hook: dbt.on-run-end.0 ...................................... [RUN]
# 17:30:51  1 of 1 OK hook: dbt.on-run-end.0 ......................................... [OK in 1.0s]
```

**詳細**: [Category 9レポート](../dbt-config/hooks-config.md)

---

## 12. Category 10: その他の設定

### 12.1 varsの利用

```bash
# コマンドラインからvarsを渡す
dbt run --select customers --vars '{"fiscal_year_start_month": 4}' --profiles-dir . --target sandbox
```

### 12.2 dbtパッケージのインストール

```bash
# packages.ymlに定義したパッケージをインストール
dbt deps

# 出力例:
# 17:30:00  Installing dbt-labs/dbt_utils
# 17:30:05  Installed from version 1.1.1
# 17:30:05  Up to date!
```

**詳細**: [Category 10レポート](../dbt-config/other-config.md)

---

## 13. ログとテーブルの確認

### 13.1 dbt実行ログの保存

```bash
# ログをファイルに保存
mkdir -p logs/verification

# すべてのカテゴリを実行してログ保存
dbt seed --profiles-dir . --target sandbox 2>&1 | tee logs/verification/01_seed.log
dbt run --profiles-dir . --target sandbox 2>&1 | tee logs/verification/02_run.log
dbt test --profiles-dir . --target sandbox 2>&1 | tee logs/verification/03_test.log
dbt snapshot --profiles-dir . --target sandbox 2>&1 | tee logs/verification/04_snapshot.log
```

### 13.2 BigQueryテーブル情報の取得

```bash
# テーブル一覧
bq ls your-gcp-project-id:dbt_sandbox

# 特定テーブルのスキーマ確認
bq show --schema --format=prettyjson your-gcp-project-id:dbt_sandbox.customers

# テーブルの統計情報
bq show your-gcp-project-id:dbt_sandbox.customers

# 出力例:
#    Last modified                  Schema                 Total Rows   Total Bytes   Expiration   Time Partitioning   Clustered Fields   Labels
#  ----------------- ------------------------------------ ------------ ------------- ------------ ------------------- ------------------ --------
#   17 Feb 00:30:00   |- customer_id: integer             100          5242880                   DAY (field: order_                     verification:model
#                     |- first_name: string                                                       _date)              customer_id,
#                     |- last_name: string                                                                            status
#                     |- first_order: date
#                     |- most_recent_order: date
#                     |- number_of_orders: integer
#                     |- customer_lifetime_value: float

# テーブルのサンプルデータ確認
bq query --use_legacy_sql=false 'SELECT * FROM `your-gcp-project-id.dbt_sandbox.customers` LIMIT 5'
```

### 13.3 コンパイル済みSQLの確認

```bash
# コンパイル済みSQLの場所
ls -lh target/compiled/jaffle_shop/models/

# 特定モデルのコンパイル済みSQLを確認
cat target/compiled/jaffle_shop/models/customers.sql

# テストのコンパイル済みSQL
cat target/compiled/jaffle_shop/models/staging/schema.yml/unique_stg_customers_customer_id.sql
```

---

## 14. トラブルシューティング

### 14.1 認証エラー

**エラー**: `Could not find Application Default Credentials`

**解決策**:

```bash
# OAuth認証を再実行
gcloud auth application-default login

# または、サービスアカウントキーを設定
export DBT_BIGQUERY_KEYFILE_JSON='...'
```

---

### 14.2 接続エラー

**エラー**: `Database Error: 403 Access Denied`

**解決策**:

```bash
# 権限を確認
gcloud projects get-iam-policy your-gcp-project-id

# 必要な権限を付与
gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member="user:your-email@example.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member="user:your-email@example.com" \
  --role="roles/bigquery.jobUser"
```

---

### 14.3 テスト失敗

**エラー**: `FAIL 5 unique_stg_orders_order_id`

**解決策**:

```bash
# 失敗したテストのコンパイル済みSQLを確認
cat target/compiled/jaffle_shop/models/staging/schema.yml/unique_stg_orders_order_id.sql

# BigQueryで直接実行して詳細を確認
bq query --use_legacy_sql=false < target/compiled/jaffle_shop/models/staging/schema.yml/unique_stg_orders_order_id.sql

# データを確認
bq query --use_legacy_sql=false 'SELECT order_id, COUNT(*) as cnt FROM `your-gcp-project-id.dbt_sandbox.stg_orders` GROUP BY order_id HAVING cnt > 1'
```

---

### 14.4 パフォーマンス問題

**症状**: `dbt run` が10分以上かかる

**解決策**:

```bash
# threadsを増やす
dbt run --threads 8 --profiles-dir . --target sandbox

# 特定のモデルのみ実行
dbt run --select +customers --profiles-dir . --target sandbox

# --log-level debug で詳細確認
dbt run --select customers --log-level debug --profiles-dir . --target sandbox
```

---

## 15. 完全な実行シーケンス（全カテゴリ）

以下は、すべてのカテゴリを順番に実行するスクリプトです。

```bash
#!/bin/bash
set -e

# プロジェクトディレクトリに移動
cd /path/to/jaffle_shop_duckdb

# ログディレクトリ作成
mkdir -p logs/verification

echo "=== Category 1: プロジェクト基本設定 ==="
dbt compile --profiles-dir . --target sandbox 2>&1 | tee logs/verification/01_compile.log

echo "=== Category 2: BigQuery接続設定 ==="
dbt debug --profiles-dir . --target sandbox 2>&1 | tee logs/verification/02_debug.log

echo "=== Category 3: モデル設定 ==="
dbt seed --profiles-dir . --target sandbox 2>&1 | tee logs/verification/03_seed.log
dbt run --select staging --profiles-dir . --target sandbox 2>&1 | tee logs/verification/04_staging.log
dbt run --select customers orders --profiles-dir . --target sandbox 2>&1 | tee logs/verification/05_marts.log
dbt run --select verification --profiles-dir . --target sandbox 2>&1 | tee logs/verification/06_verification_models.log

echo "=== Category 4: テスト設定 ==="
dbt test --select test_type:generic --profiles-dir . --target sandbox 2>&1 | tee logs/verification/07_schema_tests.log
dbt test --select test_type:singular --profiles-dir . --target sandbox 2>&1 | tee logs/verification/08_singular_tests.log
dbt test --select test_type:unit --profiles-dir . --target sandbox 2>&1 | tee logs/verification/09_unit_tests.log

echo "=== Category 5: ドキュメント設定 ==="
dbt docs generate --profiles-dir . --target sandbox 2>&1 | tee logs/verification/10_docs_generate.log

echo "=== Category 6: パフォーマンス最適化 ==="
# パフォーマンス測定（ログに時間が記録される）
time dbt run --select customers --profiles-dir . --target sandbox 2>&1 | tee logs/verification/11_performance.log

echo "=== Category 7: スナップショット設定 ==="
dbt snapshot --profiles-dir . --target sandbox 2>&1 | tee logs/verification/12_snapshot.log

echo "=== Category 8: シード設定 ==="
# 既に実行済み（Category 3で実施）

echo "=== Category 9: フック設定 ==="
# フック付きrun（ログにフック実行が記録される）
dbt run --select stg_customers --profiles-dir . --target sandbox 2>&1 | tee logs/verification/13_hooks.log

echo "=== Category 10: その他の設定 ==="
dbt deps 2>&1 | tee logs/verification/14_deps.log

echo "=== BigQueryテーブル情報取得 ==="
bq ls your-gcp-project-id:dbt_sandbox > logs/verification/15_table_list.txt
bq show your-gcp-project-id:dbt_sandbox.customers > logs/verification/16_customers_table_info.txt

echo "=== 完了 ==="
echo "ログは logs/verification/ に保存されました"
```

**実行方法**:

```bash
# 実行権限を付与
chmod +x run_all_verification.sh

# 実行
./run_all_verification.sh
```

---

## 16. 検証結果の確認

### 16.1 成功基準

すべてのカテゴリで以下が確認できればOK：

- [ ] Category 1: `dbt compile` が成功
- [ ] Category 2: `dbt debug` で Connection test: OK
- [ ] Category 3: 19個の検証モデルがすべてビルド成功
- [ ] Category 4: すべてのテストがPASS
- [ ] Category 5: `dbt docs generate` が成功
- [ ] Category 6: パフォーマンス測定完了
- [ ] Category 7: スナップショット実行成功
- [ ] Category 8: シードロード成功（100 + 99 + 113行）
- [ ] Category 9: フック実行確認
- [ ] Category 10: dbtパッケージインストール成功

### 16.2 ログの確認

```bash
# すべてのログファイルでERRORを検索
grep -i "error" logs/verification/*.log

# FAILしたテストを検索
grep -i "fail" logs/verification/*.log

# エラーがなければ何も出力されない
```

---

## 17. まとめ

この再実行ガイドに従えば、dbt + BigQueryの全設定項目検証を再現できます。

**推奨実行時間**: 約3〜4時間（すべてのカテゴリ）

**ポイント**:

- 各カテゴリを順番に実行
- ログをすべて保存
- BigQueryテーブル情報も保存
- エラーが出たらトラブルシューティングを参照

**次のステップ**:

- [プロジェクト概要](../overview.md)で全体像を把握
- 各カテゴリの詳細レポートで深掘り
- ベストプラクティスを自プロジェクトに適用

---

**最終更新**: 2026-02-17
**バージョン**: 1.0
**作成者**: dbt検証プロジェクトチーム
