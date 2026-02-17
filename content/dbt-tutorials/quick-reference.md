---
title: "検証項目クイックリファレンス"
date: 2026-02-17
tags: ["dbt", "bigquery", "reference", "index"]
categories: ["ガイド"]
draft: false
weight: -1
description: "dbt + BigQuery全130検証項目のクイックリファレンス。機能別・目的別に検証項目を素早く検索できる逆引きインデックス。"
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---

全130検証項目を**機能別・目的別**に整理したクイックリファレンスです。

---

## 🔍 検索方法

### 1. 機能名で探す

- [プロジェクト設定](#プロジェクト基本設定-15項目) - dbt_project.yml の全設定
- [BigQuery接続](#bigquery接続設定-20項目) - 認証、接続設定
- [モデル設定](#models-30項目) - マテリアライゼーション、パーティション、クラスタ
- [テスト](#tests-15項目) - Schema/Singular/Unit Tests
- [スナップショット](#snapshots-12項目) - SCD Type 2

### 2. 目的から探す

- [コスト削減したい](#コスト削減) → パーティション、クラスタ、増分戦略
- [データ品質を上げたい](#データ品質) → Tests、Contracts
- [パフォーマンス改善したい](#パフォーマンス) → 最適化設定
- [履歴を管理したい](#履歴管理) → Snapshots
- [CI/CD構築したい](#cicd) → Unit Tests、Contracts

### 3. キーワードで検索

- `Ctrl+F` (Windows) / `Cmd+F` (Mac) でページ内検索

---

## 📚 カテゴリ別検証項目一覧

### プロジェクト基本設定 (15項目)

**参照:** [プロジェクト基本設定](../dbt-connection/project-basic-config.md)

| #   | 検証項目                | 内容                         |
| --- | ----------------------- | ---------------------------- |
| 1   | `name`                  | プロジェクト名の設定         |
| 2   | `version`               | バージョン管理               |
| 3   | `config-version`        | 設定バージョン（2必須）      |
| 4   | `profile`               | profiles.yml との連携        |
| 5   | `model-paths`           | モデルディレクトリ指定       |
| 6   | `seed-paths`            | Seedsディレクトリ指定        |
| 7   | `test-paths`            | テストディレクトリ指定       |
| 8   | `analysis-paths`        | 分析クエリディレクトリ       |
| 9   | `macro-paths`           | マクロディレクトリ           |
| 10  | `snapshot-paths`        | スナップショットディレクトリ |
| 11  | `target-path`           | ビルド成果物の出力先         |
| 12  | `clean-targets`         | dbt clean で削除対象         |
| 13  | `log-path`              | ログ出力先                   |
| 14  | `packages-install-path` | パッケージインストール先     |
| 15  | `vars`                  | グローバル変数定義           |

---

### BigQuery接続設定 (20項目)

**参照:** [BigQuery接続設定](../dbt-connection/bigquery-connection.md)

#### 認証方法 (5種類)

| #   | 認証方法                        | 用途                 |
| --- | ------------------------------- | -------------------- |
| 1   | OAuth                           | 開発環境（個人認証） |
| 2   | Service Account (JSON)          | 本番環境（推奨）     |
| 3   | Service Account (JSON文字列)    | CI/CD環境            |
| 4   | OAuth Token                     | 一時的な認証         |
| 5   | Application Default Credentials | GCP環境              |

#### 接続設定項目

| #   | 設定項目                        | 内容                              |
| --- | ------------------------------- | --------------------------------- |
| 6   | `project`                       | BigQueryプロジェクトID            |
| 7   | `dataset`                       | デフォルトデータセット            |
| 8   | `threads`                       | 並列実行数（推奨: 4-24）          |
| 9   | `timeout_seconds`               | クエリタイムアウト                |
| 10  | `location`                      | リージョン（例: asia-northeast1） |
| 11  | `maximum_bytes_billed`          | クエリコスト上限                  |
| 12  | `priority`                      | クエリ優先度（interactive/batch） |
| 13  | `retries`                       | リトライ回数                      |
| 14  | `job_execution_timeout_seconds` | ジョブタイムアウト                |
| 15  | `job_retry_deadline_seconds`    | リトライ期限                      |
| 16  | `keyfile`                       | Service Account JSONパス          |
| 17  | `keyfile_json`                  | Service Account JSON文字列        |
| 18  | `token`                         | OAuth Token                       |
| 19  | `refresh_token`                 | リフレッシュトークン              |
| 20  | `client_id` / `client_secret`   | OAuth認証情報                     |

---

### Models (30項目)

**参照:** [Models](../dbt-models/models.md) / [パーティショニング＆クラスタリング](../dbt-performance/partitioning-clustering-guide.md)

#### マテリアライゼーション (5種類)

| #   | タイプ              | 用途                          | 参照                                                         |
| --- | ------------------- | ----------------------------- | ------------------------------------------------------------ |
| 1   | `table`             | 大量データ、頻繁にクエリ      | [Models](../dbt-models/models.md)                            |
| 2   | `view`              | 軽量、リアルタイム性重視      | [Models](../dbt-models/models.md)                            |
| 3   | `incremental`       | 大規模データの段階的更新      | [Models](../dbt-models/models.md)                            |
| 4   | `ephemeral`         | 中間テーブル（CTEとして展開） | [Models](../dbt-models/models.md)                            |
| 5   | `materialized_view` | 自動更新ビュー                | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md) |

#### パーティショニング (4種類)

| #   | タイプ                        | 用途                           | 参照                                                                            |
| --- | ----------------------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| 6   | DATE パーティション           | 日付カラムでパーティション     | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 7   | TIMESTAMP パーティション      | タイムスタンプでパーティション | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 8   | INT64 range パーティション    | 数値範囲でパーティション       | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 9   | Time-ingestion パーティション | 取り込み時刻でパーティション   | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |

#### クラスタリング

| #   | 設定                    | 内容                        | 参照                                                                            |
| --- | ----------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| 10  | 単一列クラスタ          | 1カラムでクラスタリング     | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 11  | 複数列クラスタ          | 最大4カラムでクラスタリング | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 12  | パーティション+クラスタ | 組み合わせ使用              | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |

#### 増分戦略 (3種類)

| #   | 戦略               | 用途                     | 参照                              |
| --- | ------------------ | ------------------------ | --------------------------------- |
| 13  | `merge`            | UPSERT処理（デフォルト） | [Models](../dbt-models/models.md) |
| 14  | `insert_overwrite` | パーティション上書き     | [Models](../dbt-models/models.md) |
| 15  | `microbatch`       | 小バッチ段階的処理       | [Models](../dbt-models/models.md) |

#### その他のモデル設定

| #   | 設定項目              | 内容                 | 参照                                                         |
| --- | --------------------- | -------------------- | ------------------------------------------------------------ |
| 16  | `schema`              | スキーマ名指定       | [Models](../dbt-models/models.md)                            |
| 17  | `alias`               | テーブルエイリアス   | [Models](../dbt-models/models.md)                            |
| 18  | `database`            | データベース名指定   | [Models](../dbt-models/models.md)                            |
| 19  | `tags`                | タグ付け             | [Models](../dbt-models/models.md)                            |
| 20  | `enabled`             | モデルの有効/無効    | [Models](../dbt-models/models.md)                            |
| 21  | `pre-hook`            | 実行前処理           | [Hooks](../dbt-config/hooks-config.md)                       |
| 22  | `post-hook`           | 実行後処理           | [Hooks](../dbt-config/hooks-config.md)                       |
| 23  | `grants`              | 権限設定             | [Models](../dbt-models/models.md)                            |
| 24  | `persist_docs`        | ドキュメント永続化   | [ドキュメント](../dbt-config/documentation-config.md)        |
| 25  | `full_refresh`        | 強制フル更新         | [Models](../dbt-models/models.md)                            |
| 26  | `unique_key`          | ユニークキー指定     | [Models](../dbt-models/models.md)                            |
| 27  | `on_schema_change`    | スキーマ変更時の挙動 | [Models](../dbt-models/models.md)                            |
| 28  | `hours_to_expiration` | テーブル有効期限     | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md) |
| 29  | `kms_key_name`        | 暗号化キー           | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md) |
| 30  | `labels`              | BigQueryラベル       | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md) |

---

### Tests (15項目)

**参照:** [Tests](../dbt-testing/testing-config.md) / [Unit Tests](../dbt-testing/unit-tests-verification.md)

#### Schema Tests (4種類)

| #   | テストタイプ      | 内容           | 参照                                      |
| --- | ----------------- | -------------- | ----------------------------------------- |
| 1   | `unique`          | 一意性チェック | [Tests](../dbt-testing/testing-config.md) |
| 2   | `not_null`        | NULL値チェック | [Tests](../dbt-testing/testing-config.md) |
| 3   | `accepted_values` | 許可値チェック | [Tests](../dbt-testing/testing-config.md) |
| 4   | `relationships`   | 外部キー整合性 | [Tests](../dbt-testing/testing-config.md) |

#### Singular Tests

| #   | 検証項目          | 内容               | 参照                                      |
| --- | ----------------- | ------------------ | ----------------------------------------- |
| 5   | カスタムSQLテスト | 独自ロジックの検証 | [Tests](../dbt-testing/testing-config.md) |

#### Unit Tests (6種類のデータ形式)

| #   | データ形式     | 内容                       | 参照                                                    |
| --- | -------------- | -------------------------- | ------------------------------------------------------- |
| 6   | CSV形式        | CSVでモックデータ定義      | [Unit Tests](../dbt-testing/unit-tests-verification.md) |
| 7   | SQL形式        | SQLでモックデータ定義      | [Unit Tests](../dbt-testing/unit-tests-verification.md) |
| 8   | Dict形式       | 辞書形式でモックデータ定義 | [Unit Tests](../dbt-testing/unit-tests-verification.md) |
| 9   | Fixture形式    | Fixtureファイル参照        | [Unit Tests](../dbt-testing/unit-tests-verification.md) |
| 10  | ref()モック    | 依存モデルのモック         | [Unit Tests](../dbt-testing/unit-tests-verification.md) |
| 11  | source()モック | ソーステーブルのモック     | [Unit Tests](../dbt-testing/unit-tests-verification.md) |

#### テスト設定

| #   | 設定項目         | 内容                  | 参照                                      |
| --- | ---------------- | --------------------- | ----------------------------------------- |
| 12  | `severity`       | エラー/警告の切り替え | [Tests](../dbt-testing/testing-config.md) |
| 13  | `warn_if`        | 警告条件（閾値）      | [Tests](../dbt-testing/testing-config.md) |
| 14  | `error_if`       | エラー条件（閾値）    | [Tests](../dbt-testing/testing-config.md) |
| 15  | `store_failures` | 失敗レコードの保存    | [Tests](../dbt-testing/testing-config.md) |

---

### Contracts (スキーマ保証) (5項目)

**参照:** [Contract設定](../dbt-performance/contracts-config.md)

| #   | 検証項目                 | 内容                     |
| --- | ------------------------ | ------------------------ |
| 1   | データ型チェック         | カラムの型安全性         |
| 2   | NOT NULL制約             | NULL許可/禁止            |
| 3   | 破壊的変更検出           | スキーマ変更時のエラー   |
| 4   | Unit Testsとの組み合わせ | 型保証+ロジック検証      |
| 5   | CI/CD統合                | コンパイル時の型チェック |

---

### Snapshots (12項目)

**参照:** [Snapshots](../dbt-performance/snapshot-config.md)

#### 戦略

| #   | 戦略             | 用途                        |
| --- | ---------------- | --------------------------- |
| 1   | `timestamp` 戦略 | updated_at カラムで変更検知 |
| 2   | `check` 戦略     | 複数カラムで変更検知        |

#### 設定項目

| #   | 設定項目                  | 内容                            |
| --- | ------------------------- | ------------------------------- |
| 3   | `target_schema`           | スナップショット保存先          |
| 4   | `unique_key`              | レコード識別キー                |
| 5   | `strategy`                | 変更検知戦略                    |
| 6   | `updated_at`              | 更新日時カラム（timestamp戦略） |
| 7   | `check_cols`              | 監視カラム（check戦略）         |
| 8   | `invalidate_hard_deletes` | 削除レコードの無効化            |
| 9   | `dbt_valid_from`          | 有効開始日時                    |
| 10  | `dbt_valid_to`            | 有効終了日時                    |
| 11  | `dbt_scd_id`              | SCD Type 2 ID                   |
| 12  | `dbt_updated_at`          | 更新タイムスタンプ              |

---

### Seeds (5項目)

**参照:** [Seeds](../dbt-config/seed-config.md)

| #   | 検証項目          | 内容                 |
| --- | ----------------- | -------------------- |
| 1   | CSVファイルロード | 基本的なCSV読み込み  |
| 2   | `column_types`    | カラム型の明示的指定 |
| 3   | `quote_columns`   | カラム名のクォート   |
| 4   | `delimiter`       | 区切り文字の変更     |
| 5   | `full_refresh`    | 強制リロード         |

---

### Hooks (8項目)

**参照:** [Hooks](../dbt-config/hooks-config.md)

| #   | Hookタイプ               | タイミング           |
| --- | ------------------------ | -------------------- |
| 1   | `on-run-start`           | dbt run 開始時       |
| 2   | `on-run-end`             | dbt run 終了時       |
| 3   | `pre-hook`               | モデル実行前         |
| 4   | `post-hook`              | モデル実行後         |
| 5   | グローバルフック         | 全モデル共通         |
| 6   | プロジェクトレベルフック | dbt_project.yml 定義 |
| 7   | モデルレベルフック       | モデル個別定義       |
| 8   | トランザクション制御     | BEGIN/COMMIT         |

---

### ドキュメント設定 (5項目)

**参照:** [ドキュメント設定](../dbt-config/documentation-config.md)

| #   | 検証項目            | 内容                     |
| --- | ------------------- | ------------------------ |
| 1   | `dbt docs generate` | ドキュメント生成         |
| 2   | `dbt docs serve`    | ローカルサーバー起動     |
| 3   | `descriptions`      | モデル・カラムの説明     |
| 4   | `doc blocks`        | 再利用可能なドキュメント |
| 5   | `meta`              | カスタムメタデータ       |

---

### パフォーマンス最適化 (10項目)

**参照:** [パフォーマンス最適化](../dbt-config/performance-optimization.md)

| #   | 最適化項目                 | 内容                     |
| --- | -------------------------- | ------------------------ |
| 1   | スロット最適化             | クエリスロット数の調整   |
| 2   | 並列実行                   | threads 設定             |
| 3   | クエリキャッシュ           | BigQueryキャッシュ活用   |
| 4   | マテリアライゼーション選択 | table vs view の使い分け |
| 5   | パーティション活用         | スキャン範囲削減         |
| 6   | クラスタリング活用         | フィルタ効率化           |
| 7   | 増分処理                   | incremental モデル       |
| 8   | `maximum_bytes_billed`     | コスト上限設定           |
| 9   | `priority` 設定            | interactive vs batch     |
| 10  | クエリ統計分析             | INFORMATION_SCHEMA 活用  |

---

### その他の設定 (10項目)

**参照:** [その他の設定](../dbt-config/other-config.md)

| #   | 設定項目              | 内容                 |
| --- | --------------------- | -------------------- |
| 1   | `vars`                | 変数定義             |
| 2   | `packages`            | 外部パッケージ管理   |
| 3   | `dispatch`            | マクロディスパッチ   |
| 4   | `analysis`            | 分析クエリ           |
| 5   | `macros`              | カスタムマクロ       |
| 6   | `quoting`             | クォート設定         |
| 7   | `query-comment`       | クエリコメント       |
| 8   | `require-dbt-version` | dbtバージョン制約    |
| 9   | `on-schema-change`    | スキーマ変更時の挙動 |
| 10  | `cache`               | キャッシュ設定       |

---

### BigQuery高度な機能 (10項目)

**参照:** [BigQuery設定リファレンス](../dbt-bigquery/bigquery-configs-complete.md) / [Python UDF](../dbt-bigquery/bigquery-python-udf-deep-dive.md)

| #   | 機能                  | 内容                     | 参照                                                           |
| --- | --------------------- | ------------------------ | -------------------------------------------------------------- |
| 1   | Materialized View     | 自動更新ビュー           | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 2   | Python UDF            | Pythonカスタム関数       | [Python UDF](../dbt-bigquery/bigquery-python-udf-deep-dive.md) |
| 3   | 暗号化（KMS）         | データ暗号化             | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 4   | テーブル有効期限      | 自動削除設定             | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 5   | ラベル                | メタデータ管理           | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 6   | Time Travel           | 過去データアクセス       | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 7   | Authorized Views      | ビュー経由のアクセス制御 | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 8   | Row-level Security    | 行レベルセキュリティ     | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 9   | Column-level Security | 列レベルセキュリティ     | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |
| 10  | Reservations          | 専用スロット予約         | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)   |

---

## 🎯 目的別逆引き

### コスト削減

| 施策           | 検証項目               | 参照                                                                            |
| -------------- | ---------------------- | ------------------------------------------------------------------------------- |
| スキャン量削減 | パーティショニング     | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| フィルタ効率化 | クラスタリング         | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 段階的更新     | incremental モデル     | [Models](../dbt-models/models.md)                                               |
| コスト上限設定 | `maximum_bytes_billed` | [BigQuery接続](../dbt-connection/bigquery-connection.md)                        |
| バッチ優先度   | `priority: batch`      | [BigQuery接続](../dbt-connection/bigquery-connection.md)                        |

### データ品質

| 施策           | 検証項目             | 参照                                                    |
| -------------- | -------------------- | ------------------------------------------------------- |
| 一意性チェック | unique テスト        | [Tests](../dbt-testing/testing-config.md)               |
| NULL値チェック | not_null テスト      | [Tests](../dbt-testing/testing-config.md)               |
| 外部キー整合性 | relationships テスト | [Tests](../dbt-testing/testing-config.md)               |
| 型安全性       | Contracts            | [Contracts](../dbt-performance/contracts-config.md)     |
| ロジック検証   | Unit Tests           | [Unit Tests](../dbt-testing/unit-tests-verification.md) |

### パフォーマンス

| 施策           | 検証項目                | 参照                                                                            |
| -------------- | ----------------------- | ------------------------------------------------------------------------------- |
| 並列実行       | threads 設定            | [パフォーマンス最適化](../dbt-config/performance-optimization.md)               |
| マテビュー活用 | materialized_view       | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md)                    |
| クエリ最適化   | パーティション+クラスタ | [パーティション＆クラスタ](../dbt-performance/partitioning-clustering-guide.md) |
| 増分処理       | incremental 戦略        | [Models](../dbt-models/models.md)                                               |

### 履歴管理

| 施策        | 検証項目             | 参照                                                         |
| ----------- | -------------------- | ------------------------------------------------------------ |
| SCD Type 2  | Snapshots            | [Snapshots](../dbt-performance/snapshot-config.md)           |
| Time Travel | BigQuery Time Travel | [BigQuery設定](../dbt-bigquery/bigquery-configs-complete.md) |

### CI/CD

| 施策                | 検証項目               | 参照                                                     |
| ------------------- | ---------------------- | -------------------------------------------------------- |
| Unit Tests          | モックデータ検証       | [Unit Tests](../dbt-testing/unit-tests-verification.md)  |
| Contracts           | コンパイル時型チェック | [Contracts](../dbt-performance/contracts-config.md)      |
| Service Account認証 | CI/CD用認証            | [BigQuery接続](../dbt-connection/bigquery-connection.md) |

---

## 📊 検証済み環境

**検証日:** 2026-02-17
**dbt:** 1.11.5
**dbt-bigquery:** 1.11.0
**BigQuery:** asia-northeast1

すべての検証項目は実際に動作確認済みです。

---

## 🔗 関連ドキュメント

- [プロジェクト概要](../overview.md) - 検証結果サマリー
- [再実行ガイド](execution-guide.md) - 検証の再現手順

---

**最終更新:** 2026-02-17
