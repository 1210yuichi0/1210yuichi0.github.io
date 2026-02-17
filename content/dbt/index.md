---
title: "dbt"
date: 2026-02-17
tags: ["dbt", "bigquery", "data-engineering", "best-practices"]
categories: ["検証"]
draft: false
description: "dbt + BigQueryの全130設定項目を10カテゴリに分けて検証"
weight: 1
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---

dbt + BigQueryの全130設定項目検証プロジェクト

## 📑 ドキュメント

- [プロジェクト概要](overview.md) - 検証環境、カテゴリ一覧
- **[クイックリファレンス](../dbt-tutorials/quick-reference.md)** - 全130項目の逆引き検索
- [再実行ガイド](../dbt-testing/execution-guide.md) - 検証の再現手順

## 📚 カテゴリ別ガイド

### 🔴 必須（本番運用に必須）

- [プロジェクト基本設定](../dbt-connection/project-basic-config.md) - dbt_project.yml の全設定
- [BigQuery接続設定](../dbt-connection/bigquery-connection.md) - 認証方法、接続設定
- [Models](../dbt-models/models.md) - マテリアライゼーション、パーティショニング、クラスタリング
- **[パーティショニング＆クラスタリング](../dbt-performance/partitioning-clustering-guide.md)** - 順番・数・使い分けの決定版（GCP公式参照）
- **[BigQuery設定リファレンス](../dbt-bigquery/bigquery-configs-complete.md)** - 詳細ガイド（暗号化、Python、マテビュー等）

### 🟡 重要（データ品質・運用効率の向上）

- [Tests](../dbt-testing/testing-config.md) - Schema/Singular/Unit Tests
- **[Unit Tests検証](../dbt-testing/unit-tests-verification.md)** - 6種類のデータ形式、CI/CD統合
- **[Contract設定（スキーマ保証）](../dbt-performance/contracts-config.md)** - 型安全性、unit testsとの組み合わせ
- [ドキュメント設定](../dbt-config/documentation-config.md) - dbt docs、descriptions
- [パフォーマンス最適化](../dbt-config/performance-optimization.md) - スロット最適化、並列実行

### 🟢 任意（高度な機能・特殊用途）

- [Snapshots](../dbt-performance/snapshot-config.md) - SCD Type 2実装
- [Seeds](../dbt-config/seed-config.md) - CSVファイルのロード
- [Hooks](../dbt-config/hooks-config.md) - pre-hook、post-hook
- [その他の設定](../dbt-config/other-config.md) - vars、packages、macros
