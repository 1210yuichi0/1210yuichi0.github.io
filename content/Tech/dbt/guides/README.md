---
title: "dbt + BigQuery - README"
date: 2026-02-17
draft: false
---

# dbt + BigQuery 完全ガイド

## 📚 ドキュメント一覧

### メインガイド

| ファイル名 | 内容 | サイズ |
|-----------|------|--------|
| [_index.md](../_index.md) | **統合インデックス** - 全体概要、学習パス | 11KB |
| [execution-guide.md](execution-guide.md) | **再実行ガイド** - 完全な実行手順 | 25KB |

### カテゴリ別ガイド（全10カテゴリ）

| ファイル名 | カテゴリ | 検証項目数 | サイズ |
|-----------|---------|----------|--------|
| [project-basic-config.md](project-basic-config.md) | #01 プロジェクト基本設定 | 15項目 | 22KB |
| [bigquery-connection.md](bigquery-connection.md) | #02 BigQuery接続設定 | 20項目 | 39KB |
| [model-config.md](model-config.md) | #03 モデル設定 | 30項目 | 38KB |
| [testing-config.md](testing-config.md) | #04 テスト設定 | 15項目 | 39KB |
| [documentation-config.md](documentation-config.md) | #05 ドキュメント設定 | 5項目 | 23KB |
| [performance-optimization.md](performance-optimization.md) | #06 パフォーマンス最適化 | 10項目 | 42KB |
| [snapshot-config.md](snapshot-config.md) | #07 スナップショット設定 | 12項目 | 42KB |
| [seed-config.md](seed-config.md) | #08 シード設定 | 5項目 | 26KB |
| [hooks-config.md](hooks-config.md) | #09 フック設定 | 8項目 | 42KB |
| [other-config.md](other-config.md) | #10 その他の設定 | 10項目 | 49KB |

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

[execution-guide.md](execution-guide.md) に完全な手順が記載されています。

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
