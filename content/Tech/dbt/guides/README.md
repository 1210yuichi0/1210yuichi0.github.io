---
title: "README"
date: 2026-02-17
draft: false
---

# dbt + BigQuery

## 📚 ドキュメント一覧

### メインガイド

| ファイル名 | 内容 | サイズ |
|-----------|------|--------|
| [_index.md](../_index.md) | **統合インデックス** - 全体概要、学習パス | 11KB |
| [execution-guide.md](execution-guide.md) | **再実行ガイド** - 実行手順 | 25KB |

### カテゴリ別ガイド（全10カテゴリ）

| ファイル名 | カテゴリ | 検証項目数 | サイズ |
|-----------|---------|----------|--------|
| [project-basic-config.md](project-basic-config.md) | プロジェクト基本設定 | 15項目 | 22KB |
| [bigquery-connection.md](bigquery-connection.md) | BigQuery接続設定 | 20項目 | 39KB |
| [model-config.md](model-config.md) | モデル設定 | 30項目 | 38KB |
| [testing-config.md](testing-config.md) | テスト設定 | 15項目 | 39KB |
| [documentation-config.md](documentation-config.md) | ドキュメント設定 | 5項目 | 23KB |
| [performance-optimization.md](performance-optimization.md) | パフォーマンス最適化 | 10項目 | 42KB |
| [snapshot-config.md](snapshot-config.md) | スナップショット設定 | 12項目 | 42KB |
| [seed-config.md](seed-config.md) | シード設定 | 5項目 | 26KB |
| [hooks-config.md](hooks-config.md) | フック設定 | 8項目 | 42KB |
| [other-config.md](other-config.md) | その他の設定 | 10項目 | 49KB |

**総計**: 12ファイル、130検証項目、約400KB

---

## 🎯 クイックスタート

### 1. 初めての方

[_index.md](../_index.md) から始めて、推奨学習パスに従ってください。

### 2. 特定の機能を調べたい方

| 調べたい内容 | 参照先 |
|------------|-------|
| 認証方法の設定 | [bigquery-connection.md](bigquery-connection.md) |
| パーティション・クラスタリング | [model-config.md](model-config.md) |
| テストの書き方 | [testing-config.md](testing-config.md) |
| パフォーマンス改善 | [performance-optimization.md](performance-optimization.md) |
| 履歴データ管理（SCD Type 2） | [snapshot-config.md](snapshot-config.md) |

### 3. すべて検証を再実行したい方

[execution-guide.md](execution-guide.md) に手順が記載されています。

---

## 📊 統計情報

- **総検証項目数**: 130項目
- **総Mermaid図**: 93個以上
- **総ドキュメント**: 12ファイル
- **検証モデル数**: 19個
- **テスト数**: 15個以上

---

## ✅ 品質保証

すべてのレポートには以下が含まれます：

- ✅ Hugo/Jekyll対応frontmatter
- ✅ 5〜14個のMermaid図
- ✅ 実装例（SQLコード全文）
- ✅ ベストプラクティス
- ✅ トラブルシューティング
- ✅ GCPプロジェクトIDマスキング済み

---

## 🔗 関連リソース

- [dbt公式ドキュメント](https://docs.getdbt.com/)
- [dbt-bigquery公式ドキュメント](https://docs.getdbt.com/reference/warehouse-setups/bigquery-setup)
- [BigQuery公式ドキュメント](https://cloud.google.com/bigquery/docs)

---

**最終更新**: 2026-02-17
**バージョン**: 1.0
**作成者**: dbt検証プロジェクトチーム


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
- **設定テンプレート**（コピペで使える設定例）

### 5. 検証モデルのコード
- **SQLコード全文**（リンクではなく直接記載）
- **折りたたみ機能**（長いコードは`<details>`タグで）

---

## 📊 検証の特徴

### ✅ 実際に動かして検証

- すべての設定項目を**実際にBigQueryで実行**
- 成功例・失敗例の両方を記録
- エラーメッセージと解決策を網羅

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
# プロジェクト基本設定
dbt compile --profiles-dir . --target sandbox

# BigQuery接続設定
dbt run --select stg_customers --profiles-dir . --target sandbox

# モデル設定
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

- [再実行ガイド](guides/execution-guide.md): 検証の再現手順

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
