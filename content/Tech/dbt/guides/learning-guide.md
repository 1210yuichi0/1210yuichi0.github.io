---
title: "学習ガイド"
date: 2026-02-17
draft: false
weight: 1
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---



このガイドでは、dbt + BigQueryドキュメントの効果的な学習方法を提供します。

---

## 🎯 推奨学習パス

### 初学者向け（1週間）

**Day 1-2**: 基本設定と接続
- [プロジェクト基本設定](../project-basic-config.md): dbt_project.yml の理解
- [BigQuery接続設定](../bigquery-connection.md): 認証方法（OAuth vs Service Account）

**Day 3-4**: Models
- [Models](../categories/models/): マテリアライゼーション、パーティション、クラスタリング

**Day 5**: Tests
- [Tests](../testing-config.md): Schema Tests、データ品質の保証

**Day 6**: ドキュメントとパフォーマンス
- [ドキュメント設定](../documentation-config.md): dbt docs の生成
- [パフォーマンス最適化](../performance-optimization.md): クエリ最適化の基本

**Day 7**: 総復習と実践プロジェクト

---

### 中級者向け（3日間）

**Day 1**: 高度なモデル設定・最適化
- [Models](../categories/models/): 増分戦略の使い分け
- [パフォーマンス最適化](../performance-optimization.md): パフォーマンスチューニング

**Day 2**: 高度なテストとSnapshots
- [Tests](../testing-config.md): Singular Tests、Unit Tests
- [Snapshots](../snapshot-config.md): SCD Type 2実装

**Day 3**: HooksとSeeds
- [Hooks](../hooks-config.md): カスタムフック
- [Seeds](../seed-config.md): CSVデータのロード
- [その他の設定](../other-config.md): dbtパッケージ管理

---

### 上級者向け（ピンポイント学習）

必要な機能だけを深掘り：

| 目的 | 参照先 |
|------|--------|
| **コスト最適化** | [BigQuery接続設定](../bigquery-connection.md), [Models](../categories/models/), [パフォーマンス最適化](../performance-optimization.md) |
| **データ品質** | [Tests](../testing-config.md), [Contract設定](../contracts-config.md) |
| **運用自動化** | [Hooks](../hooks-config.md) |
| **履歴管理** | [Snapshots](../snapshot-config.md) |
| **BigQuery全機能** | [BigQuery設定リファレンス](../bigquery-configs-complete.md) |

---

## 🔧 各レポートの構成

すべてのカテゴリ別ガイドには以下が含まれます：

### 1. 検証概要
- 検証日時、バージョン情報
- 検証目的と対象項目

### 2. 詳細な検証内容
- 各設定項目の説明
- 実装例（SQLコード、YAML設定）
- 実行結果のログ（成功/失敗例）
- BigQueryテーブル情報（スキーマ、統計）

### 3. 視覚的な理解
- 5〜14個のMermaid図（フローチャート、依存関係図、比較表）
- アーキテクチャ図、意思決定フロー

### 4. 実践的なガイド
- ベストプラクティス（環境別の推奨設定）
- トラブルシューティング（よくある問題と解決策）
- 設定テンプレート（コピペで使える設定例）

### 5. 検証モデルのコード
- SQLコード全文（リンクではなく直接記載）
- 折りたたみ機能（長いコードは`<details>`タグで）

---

## 📊 検証の特徴

### ✅ 実際に動かして検証

- すべての設定項目を実際のBigQueryプロジェクトで実行
- 成功例だけでなく失敗例も記録
- 実行ログをそのまま掲載（マスキング済み）

### ✅ コピペですぐ使える

- SQLコード全文を掲載
- 設定ファイル（YAML）の完全なサンプル
- エラーメッセージと解決策を網羅

### ✅ 視覚的にわかりやすい

- Mermaid図で設定の関係性を可視化
- フローチャートで意思決定をサポート
- 比較表で選択肢を明確化

---

## 🚀 クイックスタート

### 特定の機能を調べたい方

| 調べたい内容 | 参照先 |
|------------|-------|
| 認証方法の設定 | [BigQuery接続設定](../bigquery-connection.md) |
| パーティション・クラスタリング | [Models](../categories/models/) |
| テストの書き方 | [Tests](../testing-config.md) |
| パフォーマンス改善 | [パフォーマンス最適化](../performance-optimization.md) |
| 履歴データ管理（SCD Type 2） | [Snapshots](../snapshot-config.md) |
| スキーマ保証 | [Contract設定](../contracts-config.md) |
| Unit Testsの実装 | [Unit Tests検証](../unit-tests-verification.md) |

### 検証を再実行したい方

[再実行ガイド](execution-guide.md) に手順が記載されています。

---

## 🔗 関連リソース

- [dbt公式ドキュメント](https://docs.getdbt.com/)
- [dbt-bigquery公式ドキュメント](https://docs.getdbt.com/reference/warehouse-setups/bigquery-setup)
- [BigQuery公式ドキュメント](https://cloud.google.com/bigquery/docs)

---

**最終更新**: 2026-02-17
