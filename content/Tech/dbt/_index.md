---
title: "dbt + BigQuery"
date: 2026-02-17
tags: ["dbt", "bigquery", "data-engineering", "best-practices"]
categories: ["検証"]
draft: false
description: "dbt + BigQueryの全130設定項目を10カテゴリに分けて完全検証。実行ログ、ベストプラクティス、トラブルシューティングを含む包括的ガイド。"
weight: 1
---

# dbt + BigQuery

dbt core + BigQueryの全設定項目（130項目）を完全に検証し、実運用で使えるベストプラクティスをまとめたプロジェクトです。

## 📑 ドキュメント

- [プロジェクト概要](overview.md) - 検証環境、カテゴリ一覧
- [ガイド](guides/README.md) - 学習パス、クイックスタート、活用例

## 📚 カテゴリ別ガイド

### 🔴 必須（本番運用に必須）
- [プロジェクト基本設定](project-basic-config.md) - dbt_project.yml の全設定
- [BigQuery接続設定](bigquery-connection.md) - 認証方法、接続設定
- [モデル設定](model-config.md) - マテリアライゼーション、パーティショニング、クラスタリング
- **[BigQuery全設定リファレンス](bigquery-configs-complete.md)** - 全40項目の完全ガイド（暗号化、Python、マテビュー等）

### 🟡 重要（データ品質・運用効率の向上）
- [テスト設定](testing-config.md) - Schema/Singular/Unit Tests
- **[Unit Tests完全検証](unit-tests-verification.md)** - 6種類のデータ形式、CI/CD統合
- **[Contract設定（スキーマ保証）](contracts-config.md)** - 型安全性、unit testsとの組み合わせ
- [ドキュメント設定](documentation-config.md) - dbt docs、descriptions
- [パフォーマンス最適化](performance-optimization.md) - スロット最適化、並列実行

### 🟢 任意（高度な機能・特殊用途）
- [スナップショット設定](snapshot-config.md) - SCD Type 2実装
- [シード設定](seed-config.md) - CSVファイルのロード
- [フック設定](hooks-config.md) - pre-hook、post-hook
- [その他の設定](other-config.md) - vars、packages、macros
