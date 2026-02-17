---
title: "Models"
date: 2026-02-17
tags: ["dbt", "bigquery", "materialization", "partitioning", "clustering"]
categories: ["dbt"]
draft: false
weight: 30
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---

## 検証概要

✅ **実測検証完了**

**検証日時**: 2026-02-17
**環境**: dbt 1.11.5 + dbt-bigquery 1.11.0
**BigQueryプロジェクト**: sdp-sb-yada-29d2
**データセット**: dbt_sandbox
**リージョン**: asia-northeast1
**並列スレッド数**: 24

### 実測検証結果

**27モデル実行: 21成功、6エラー（学習目的）**
⏱️ **実行時間**: 9.91秒
🧵 **並列実行**: 24スレッド

### 検証目的

dbt + BigQueryのモデル設定30項目を実際に検証し、以下を明らかにする：

1. ✅ **各設定の実際の挙動**: BigQueryでどのように実装されるか
2. ✅ **ベストプラクティス**: どの設定をどのケースで使うべきか
3. ✅ **制約事項**: BigQuery特有の制限と注意点
4. ✅ **パフォーマンス影響**: コストと速度への影響

### 検証結果サマリー

| カテゴリ        | 検証項目数 | 成功 | 失敗 | 成功率 | 詳細                                     |
| --------------- | ---------- | ---- | ---- | ------ | ---------------------------------------- |
| Materialization | 5          | 5    | 0    | 100%   | [詳細](models-materialization.md)        |
| パーティション  | 6          | 4    | 2    | 67%    | [詳細](models-partitioning.md)           |
| クラスタリング  | 3          | 3    | 0    | 100%   | [詳細](models-clustering.md)             |
| 増分戦略        | 3          | 2    | 1    | 67%    | [詳細](models-incremental-strategies.md) |
| その他の設定    | 2          | 2    | 0    | 100%   | [詳細](models-advanced-settings.md)      |

---

## 📚 モデル設定ガイド

### 🔴 必須スキル

#### [Materialization（実体化方式）](models-materialization.md)

**5種類のマテリアライゼーション全検証**

- **table** - 物理テーブル作成（大量データ、頻繁なクエリ）
- **view** - ビュー作成（リアルタイム性重視、軽量）
- **incremental** - 増分更新（大規模データの段階的更新）
- **ephemeral** - CTE展開（中間テーブル不要）
- **materialized_view** - マテリアライズドビュー（自動リフレッシュ）

**学習時間**: 2時間
**検証項目**: 5項目（全成功）

---

#### [Partitioning（パーティション設定）](models-partitioning.md)

**4種類のパーティション戦略**

- **DATE パーティション** - 日付カラムで分割
- **TIMESTAMP パーティション** - タイムスタンプで分割
- **INT64 range パーティション** - 数値範囲で分割
- **Time-ingestion パーティション** - 取り込み時刻で分割

**学習時間**: 3時間
**検証項目**: 6項目（4成功、2エラー）

**エラー検証**:

- TIMESTAMP パーティションの制約
- パーティション数上限の確認

---

#### [Clustering（クラスタリング設定）](models-clustering.md)

**クラスタリング最適化**

- **単一列クラスタ** - 1カラムでクラスタリング
- **複数列クラスタ** - 最大4カラムでクラスタリング（順序重要）
- **パーティション + クラスタ** - 組み合わせ使用

**学習時間**: 2時間
**検証項目**: 3項目（全成功）

---

### 🟡 中級スキル

#### [Incremental Strategies（増分戦略）](models-incremental-strategies.md)

**3種類の増分更新戦略**

- **merge** - UPSERT処理（デフォルト）
- **insert_overwrite** - パーティション上書き
- **microbatch** - 小バッチ段階的処理

**学習時間**: 3時間
**検証項目**: 3項目（2成功、1エラー）

**エラー検証**:

- microbatch戦略の設定ミス

---

### 🟢 その他

#### [Advanced Settings（高度な設定）](models-advanced-settings.md)

**その他のモデル設定とベストプラクティス**

- スキーマ・エイリアス設定
- タグ・ラベル管理
- 権限・暗号化設定
- ベストプラクティス
- 制約事項と注意点

**学習時間**: 1.5時間
**検証項目**: 2項目（全成功）

---

## 🎯 学習パス推奨

### 初級者向け (2日間)

1. [Materialization](models-materialization.md) - table, view の理解
2. [Partitioning](models-partitioning.md) 基本 - DATE パーティション
3. [Clustering](models-clustering.md) 基本 - 単一列クラスタ

### 中級者向け (3日間)

1. [Materialization](models-materialization.md) - incremental, ephemeral
2. [Partitioning](models-partitioning.md) 応用 - INT64 range, Time-ingestion
3. [Clustering](models-clustering.md) 応用 - 複数列、パーティション併用
4. [Incremental Strategies](models-incremental-strategies.md) - merge, insert_overwrite

### 上級者向け (2日間)

1. [Materialized View](materialization.md#materialized-view) - 自動リフレッシュ
2. [Microbatch Strategy](incremental-strategies.md#microbatch) - 大規模データ処理
3. [Advanced Settings](models-advanced-settings.md) - 暗号化、権限、最適化

---

## 📖 関連ドキュメント

- [クイックリファレンス](../../guides/quick-reference.md) - 全検証項目の逆引き
- [パーティショニング＆クラスタリングガイド](../../features/partitioning-clustering-guide.md) - 専門ガイド

---

**最終更新**: 2026-02-17
