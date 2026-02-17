---
title: "プロジェクト概要"
date: 2026-02-17
tags: ["dbt", "bigquery", "data-engineering", "best-practices"]
categories: ["検証"]
draft: false
description: "dbt + BigQueryの全130設定項目を10カテゴリに分けて検証。実行ログ、ベストプラクティス、トラブルシューティングを含む包括的ガイド。"
weight: 2
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---

## プロジェクト情報

✅ **実測検証完了**

**検証日時**: 2026-02-17  
**dbtバージョン**: 1.11.5  
**dbt-bigqueryバージョン**: 1.11.0  
**検証環境**: macOS (Darwin 24.6.0)  
**BigQueryプロジェクト**: sdp-sb-yada-29d2  
**データセット**: dbt_sandbox  
**リージョン**: asia-northeast1  
**並列スレッド数**: 24  
**総検証項目数**: 130項目  
**カテゴリ数**: 10カテゴリ

このプロジェクトは、dbt core + BigQueryの**全設定項目（130項目）を実際に検証**し、実運用で使えるベストプラクティスをまとめたものです。

### 実測検証サマリー

- **Models実行**: 27モデル（21成功、6エラー）、9.91秒
- **Seeds実行**: 3ファイル、312行、約5秒
- **Tests実行**: 31テスト（30 PASS、1 FAIL）、11.53秒
- **Unit Tests実行**: 9テスト（全PASS）、10.76秒
- **Docs生成**: catalog.json（28KB）、manifest.json（725KB）、約10秒

---

## 📚 カテゴリ別ガイド一覧

### 🔴 必須カテゴリ（本番運用に必須）

| #                                             | カテゴリ                 | 検証項目数 | 所要時間 | 状態    |
| --------------------------------------------- | ------------------------ | ---------- | -------- | ------- |
| [](../dbt-categories/project-basic-config.md) | **プロジェクト基本設定** | 15項目     | 2時間    | ✅ 完了 |
| [](../dbt-categories/bigquery-connection.md)  | **BigQuery接続設定**     | 20項目     | 2時間    | ✅ 完了 |
| [](../dbt-categories/models.md)               | **Models**               | 30項目     | 4時間    | ✅ 完了 |

**カテゴリ1-3の主な内容**:

- dbt_project.yml の全設定項目
- profiles.yml の5種類の認証方法（OAuth, Service Account等）
- マテリアライゼーション（table, view, incremental, ephemeral, materialized_view）
- パーティショニング（DATE, TIMESTAMP, INT64, time-ingestion）
- クラスタリング（単一列、複数列、パーティションとの組み合わせ）
- 増分戦略（merge, insert_overwrite, microbatch）

---

### 🟡 重要カテゴリ（データ品質・運用効率の向上）

| #                                                 | カテゴリ                 | 検証項目数 | 所要時間 | 状態    |
| ------------------------------------------------- | ------------------------ | ---------- | -------- | ------- |
| [](../dbt-categories/testing-config.md)           | **Tests**                | 15項目     | 3時間    | ✅ 完了 |
| [](../dbt-categories/documentation-config.md)     | **ドキュメント設定**     | 5項目      | 1時間    | ✅ 完了 |
| [](../dbt-categories/performance-optimization.md) | **パフォーマンス最適化** | 10項目     | 2時間    | ✅ 完了 |

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

| #                                        | カテゴリ         | 検証項目数 | 所要時間 | 状態    |
| ---------------------------------------- | ---------------- | ---------- | -------- | ------- |
| [](../dbt-categories/snapshot-config.md) | **Snapshots**    | 12項目     | 2時間    | ✅ 完了 |
| [](../dbt-categories/seed-config.md)     | **Seeds**        | 5項目      | 1時間    | ✅ 完了 |
| [](../dbt-categories/hooks-config.md)    | **Hooks**        | 8項目      | 1.5時間  | ✅ 完了 |
| [](../dbt-categories/other-config.md)    | **その他の設定** | 10項目     | 1.5時間  | ✅ 完了 |

**カテゴリ7-10の主な内容**:

- SCD Type 2実装（timestamp戦略、check戦略）
- dbt seed（CSVファイルのロード）
- column_types、quote_columns、delimiter
- on-run-start、on-run-end、pre-hook、post-hook
- vars、packages、dispatch、analysis、macros、quoting

---

**最終更新**: 2026-02-17
