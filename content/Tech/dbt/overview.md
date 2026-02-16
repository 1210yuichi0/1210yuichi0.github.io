---
title: "dbt + BigQuery プロジェクト概要"
date: 2026-02-17
tags: ["dbt", "bigquery", "data-engineering", "best-practices"]
categories: ["検証"]
draft: false
description: "dbt + BigQueryの全130設定項目を10カテゴリに分けて完全検証。実行ログ、ベストプラクティス、トラブルシューティングを含む包括的ガイド。"
weight: 2
---

# dbt + BigQuery プロジェクト概要

## プロジェクト情報

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
| [](project-basic-config.md) | **プロジェクト基本設定** | 15項目 | 2時間 | ✅ 完了 |
| [](bigquery-connection.md) | **BigQuery接続設定** | 20項目 | 2時間 | ✅ 完了 |
| [](model-config.md) | **モデル設定** | 30項目 | 4時間 | ✅ 完了 |

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
| [](testing-config.md) | **テスト設定** | 15項目 | 3時間 | ✅ 完了 |
| [](documentation-config.md) | **ドキュメント設定** | 5項目 | 1時間 | ✅ 完了 |
| [](performance-optimization.md) | **パフォーマンス最適化** | 10項目 | 2時間 | ✅ 完了 |

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
| [](snapshot-config.md) | **スナップショット設定** | 12項目 | 2時間 | ✅ 完了 |
| [](seed-config.md) | **シード設定** | 5項目 | 1時間 | ✅ 完了 |
| [](hooks-config.md) | **フック設定** | 8項目 | 1.5時間 | ✅ 完了 |
| [](other-config.md) | **その他の設定** | 10項目 | 1.5時間 | ✅ 完了 |

**カテゴリ7-10の主な内容**:
- SCD Type 2実装（timestamp戦略、check戦略）
- dbt seed（CSVファイルのロード）
- column_types、quote_columns、delimiter
- on-run-start、on-run-end、pre-hook、post-hook
- vars、packages、dispatch、analysis、macros、quoting

---

## 📖 詳細ガイド

学習パス、クイックスタート、活用例などの詳細は [ガイドREADME](guides/README.md) を参照してください。

---

**最終更新**: 2026-02-17
