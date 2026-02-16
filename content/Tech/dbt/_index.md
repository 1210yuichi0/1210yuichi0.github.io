---
title: "dbt + BigQuery - 全設定項目検証プロジェクト"
date: 2026-02-17
tags: ["dbt", "bigquery", "data-engineering", "complete-guide", "best-practices"]
categories: ["検証", "完全ガイド"]
draft: false
description: "dbt + BigQueryの全130設定項目を10カテゴリに分けて完全検証。実行ログ、ベストプラクティス、トラブルシューティングを含む包括的ガイド。"
weight: 1
---

# dbt + BigQuery 完全ガイド

## プロジェクト概要

**検証日時**: 2026-02-17
**dbtバージョン**: 1.11.5
**dbt-bigqueryバージョン**: 1.11.0
**検証環境**: macOS (Darwin 24.6.0)
**総検証項目数**: 130項目
**カテゴリ数**: 10カテゴリ

このプロジェクトは、dbt core + BigQueryの**全設定項目（130項目）を完全に検証**し、実運用で使えるベストプラクティスをまとめたものです。

---

## 📚 カテゴリ別ガイド一覧

### 🔴 必須カテゴリ（本番運用に必須）

| # | カテゴリ | 検証項目数 | 所要時間 | 状態 |
|---|---------|----------|---------|------|
| [1](project-basic-config.md) | **プロジェクト基本設定** | 15項目 | 2時間 | ✅ 完了 |
| [2](bigquery-connection.md) | **BigQuery接続設定** | 20項目 | 2時間 | ✅ 完了 |
| [3](model-config.md) | **モデル設定** | 30項目 | 4時間 | ✅ 完了 |

**カテゴリ1-3の主な内容**:
- dbt_project.yml の全設定項目
- profiles.yml の5種類の認証方法（OAuth, Service Account等）
- マテリアライゼーション（table, view, incremental, ephemeral, materialized_view）
- パーティショニング（DATE, TIMESTAMP, INT64, time-ingestion）
- クラスタリング（単一列、複数列、パーティションとの組み合わせ）
- 増分戦略（merge, insert_overwrite, microbatch）

---

### 🟡 重要カテゴリ（データ品質・運用効率の向上）

| # | カテゴリ | 検証項目数 | 所要時間 | 状態 |
|---|---------|----------|---------|------|
| [4](testing-config.md) | **テスト設定** | 15項目 | 3時間 | ✅ 完了 |
| [5](documentation-config.md) | **ドキュメント設定** | 5項目 | 1時間 | ✅ 完了 |
| [6](performance-optimization.md) | **パフォーマンス最適化** | 10項目 | 2時間 | ✅ 完了 |

**カテゴリ4-6の主な内容**:
- Schema Tests（unique, not_null, accepted_values, relationships）
- Singular Tests（カスタムSQLテスト）
- Unit Tests（モックデータでのロジック検証）
- テスト設定（severity, warn_if, error_if, store_failures）
- dbt docs generate / serve
- descriptions、doc blocks、meta、exposures
- スロット最適化、クエリパフォーマンス、並列実行
- キャッシュ戦略、マテリアライゼーション選択

---

### 🟢 任意カテゴリ（高度な機能・特殊用途）

| # | カテゴリ | 検証項目数 | 所要時間 | 状態 |
|---|---------|----------|---------|------|
| [7](snapshot-config.md) | **スナップショット設定** | 12項目 | 2時間 | ✅ 完了 |
| [8](seed-config.md) | **シード設定** | 5項目 | 1時間 | ✅ 完了 |
| [9](hooks-config.md) | **フック設定** | 8項目 | 1.5時間 | ✅ 完了 |
| [10](other-config.md) | **その他の設定** | 10項目 | 1.5時間 | ✅ 完了 |

**カテゴリ7-10の主な内容**:
- SCD Type 2実装（timestamp戦略、check戦略）
- dbt seed（CSVファイルのロード）
- column_types、quote_columns、delimiter
- on-run-start、on-run-end、pre-hook、post-hook
- vars、packages、dispatch、analysis、macros、quoting

---

## 🎯 推奨学習パス

### 初学者向け（1週間）

**Day 1-2**: Category 1-2（基本設定と接続）
- dbt_project.yml の理解
- BigQuery認証の設定（OAuth vs Service Account）

**Day 3-4**: Category 3（モデル設定）
- マテリアライゼーションの選択基準
- パーティション・クラスタリングの実装

**Day 5**: Category 4（テスト）
- Schema Testsの実装
- データ品質の保証

**Day 6**: Category 5-6（ドキュメント・パフォーマンス）
- dbt docsの生成
- クエリ最適化の基本

**Day 7**: 総復習と実践プロジェクト

---

### 中級者向け（3日間）

**Day 1**: Category 3, 6（高度なモデル設定・最適化）
- 増分戦略の使い分け
- パフォーマンスチューニング

**Day 2**: Category 4, 7（高度なテスト・スナップショット）
- Singular Tests、Unit Tests
- SCD Type 2実装

**Day 3**: Category 9-10（フック・高度な設定）
- カスタムフック
- dbtパッケージ管理

---

### 上級者向け（ピンポイント学習）

必要な機能だけを深掘り：
- **コスト最適化**: Category 2, 3, 6
- **データ品質**: Category 4
- **運用自動化**: Category 9（フック）
- **履歴管理**: Category 7（スナップショット）

---

## 🔧 各レポートの構成

すべてのレポートには以下が含まれます：

### 1. 検証概要
- 検証日時、バージョン情報
- 検証目的と対象項目

### 2. 詳細な検証内容
- 各設定項目の説明
- 実装例（SQLコード、YAML設定）
- **実行結果のログ**（成功/失敗例）
- **BigQueryテーブル情報**（スキーマ、統計）

### 3. 視覚的な理解
- **5〜9個のMermaid図**（フローチャート、依存関係図、比較表）
- アーキテクチャ図、意思決定フロー

### 4. 実践的なガイド
- **ベストプラクティス**（環境別の推奨設定）
- **トラブルシューティング**（よくある問題と解決策）
- **設定テンプレート**（コピペで使える完全な設定例）

### 5. 検証モデルのコード
- **SQLコード全文**（リンクではなく直接記載）
- **折りたたみ機能**（長いコードは`<details>`タグで）

---

## 📊 検証の特徴

### ✅ 実際に動かして検証

- すべての設定項目を**実際にBigQueryで実行**
- 成功例・失敗例の両方を記録
- エラーメッセージと解決策を完全網羅

### ✅ 実運用レベルの品質

- 本番環境での推奨設定
- 環境別（dev/staging/prod）の設定例
- CI/CD統合の方法

### ✅ 豊富な視覚資料

- 合計**60個以上のMermaid図**
- データフロー、依存関係、意思決定ツリー
- 比較表、チェックリスト

### ✅ 再現可能

- すべての検証手順を記載
- [再実行ガイド](guides/execution-guide.md)で誰でも検証可能
- テンプレートコードをそのまま使用可能

---

## 🚀 クイックスタート

### 1. 環境準備

```bash
# dbt-bigqueryのインストール
pip install dbt-bigquery

# プロジェクトのクローン
git clone <repository-url>
cd jaffle_shop_duckdb

# 接続確認
dbt debug --profiles-dir . --target sandbox
```

### 2. 最初の検証を実行

```bash
# Category 1: プロジェクト基本設定
dbt compile --profiles-dir . --target sandbox

# Category 2: BigQuery接続設定
dbt run --select stg_customers --profiles-dir . --target sandbox

# Category 3: モデル設定
dbt run --select mat_table_demo --profiles-dir . --target sandbox
```

### 3. ドキュメント生成

```bash
# dbt docsの生成と表示
dbt docs generate --profiles-dir . --target sandbox
dbt docs serve --port 8080
```

詳細な実行手順は [再実行ガイド](guides/execution-guide.md) を参照してください。

---

## 📁 ファイル構成

```
jaffle_shop_duckdb/
├── dbt_project.yml              # プロジェクト設定
├── profiles.yml                 # BigQuery接続設定
├── models/                      # モデル定義
│   ├── staging/                 # Staging層
│   │   ├── stg_customers.sql
│   │   ├── stg_orders.sql
│   │   ├── stg_payments.sql
│   │   └── schema.yml           # Schema Tests定義
│   ├── customers.sql            # Marts層
│   ├── orders.sql
│   ├── verification/            # 検証用モデル（19個）
│   │   ├── mat_table_demo.sql
│   │   ├── partition_date_demo.sql
│   │   ├── cluster_multi_demo.sql
│   │   └── ... (16個)
│   ├── _customers__models.yml   # Unit Tests定義
│   └── _orders__models.yml
├── tests/                       # Singular Tests
│   ├── assert_positive_order_amount.sql
│   └── assert_valid_order_status_transition.sql
├── snapshots/                   # スナップショット
│   └── customers_snapshot.sql
├── seeds/                       # シードCSV
│   ├── raw_customers.csv
│   ├── raw_orders.csv
│   └── raw_payments.csv
├── macros/                      # カスタムマクロ
│   └── mock_data.sql
└── docs/                        # ドキュメント
    ├── bigquery_dbt_config/     # 検証レポート（10個）
    │   ├── project-basic-config.md
    │   ├── bigquery-connection.md
    │   ├── ... (10個)
    │   └── execution-guide.md   # 再実行ガイド
    └── README.md
```

---

## 🎓 学習リソース

### 公式ドキュメント

- [dbt公式ドキュメント](https://docs.getdbt.com/)
- [dbt-bigquery公式ドキュメント](https://docs.getdbt.com/reference/warehouse-setups/bigquery-setup)
- [BigQuery公式ドキュメント](https://cloud.google.com/bigquery/docs)

### このプロジェクトの関連ドキュメント

- [再実行ガイド](guides/execution-guide.md): 検証の完全な再現手順

---

## 💡 活用例

### ケース1: 新規プロジェクトのセットアップ

1. [Category 1](project-basic-config.md)でdbt_project.ymlを設定
2. [Category 2](bigquery-connection.md)で認証を設定
3. [Category 3](model-config.md)でモデル戦略を決定

### ケース2: データ品質の向上

1. [Category 4](testing-config.md)でテスト戦略を設計
2. Schema TestsとUnit Testsを実装
3. CI/CDでテストを自動化

### ケース3: パフォーマンス問題の解決

1. [Category 6](performance-optimization.md)でボトルネックを特定
2. パーティション・クラスタリングを追加
3. 増分戦略を最適化

### ケース4: 履歴データの管理

1. [Category 7](snapshot-config.md)でSCD Type 2を実装
2. timestamp戦略またはcheck戦略を選択
3. 定期的なスナップショット実行を自動化

---

## 🤝 コントリビューション

### フィードバック歓迎

- 誤字・脱字の報告
- 追加検証項目の提案
- ベストプラクティスの共有
- トラブルシューティング事例の追加

### 更新履歴

- **2026-02-17**: 初版リリース（全10カテゴリ、130項目検証完了）

---

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

## 📧 お問い合わせ

質問・フィードバックは以下まで：
- GitHub Issues: (リポジトリURL)
- Email: data@example.com

---

**最終更新**: 2026-02-17
**バージョン**: 1.0
**作成者**: dbt検証プロジェクトチーム
