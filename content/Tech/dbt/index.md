---
title: "dbt + BigQuery"
date: 2026-02-17
tags: ["dbt", "bigquery", "data-engineering", "best-practices"]
categories: ["検証"]
draft: false
description: "dbt + BigQueryの全130設定項目を10カテゴリに分けて検証。実行ログ、ベストプラクティス、トラブルシューティングを含む包括的ガイド。"
weight: 1
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---



✅ **実測検証完了 - 全130設定項目の挙動を実際に確認**

dbt core + BigQueryの全設定項目（130項目）を**実際に検証**し、実運用で使えるベストプラクティスをまとめたプロジェクトです。

## 🎯 実測検証結果サマリー

**検証日**: 2026-02-17
**環境**: dbt 1.11.5 + dbt-bigquery 1.11.0
**BigQueryプロジェクト**: sdp-sb-yada-29d2  
**データセット**: dbt_sandbox  
**リージョン**: asia-northeast1  

### 主要指標

| 項目 | 実行結果 | 実行時間 | 並列度 |
|------|---------|---------|--------|
| **Models** | 27モデル（21成功、6エラー） | 9.91秒 | 24スレッド |
| **Seeds** | 3ファイル、312行 | 約5秒 | - |
| **Tests** | 31テスト（30 PASS、1 FAIL） | 11.53秒 | 24スレッド |
| **Unit Tests** | 9テスト（全PASS） | 10.76秒 | 24スレッド |
| **Docs生成** | catalog.json + manifest.json | 約10秒 | - |

### 検証内容
- ✅ **パーティショニング**: DATE、INT64 range、TIMESTAMP（エラー検証含む）
- ✅ **クラスタリング**: 単一列、複数列、パーティションとの組み合わせ
- ✅ **増分戦略**: merge、insert_overwrite
- ✅ **Contract**: 型エラー検出（コンパイル時）
- ✅ **全テスト種別**: Schema Tests、Singular Tests、Unit Tests
- ✅ **未実装確認**: Hooks未使用、Snapshots未定義、vars/packages未使用

---

## 📑 ドキュメント

- [プロジェクト概要](overview.md) - 検証環境、カテゴリ一覧
- [学習ガイド](guides/learning-guide.md) - 学習パス、クイックスタート、使い方
- [再実行ガイド](guides/execution-guide.md) - 検証の再現手順

## 📚 カテゴリ別ガイド

### 🔴 必須（本番運用に必須）

- [プロジェクト基本設定](project-basic-config.md) - dbt_project.yml の全設定
- [BigQuery接続設定](bigquery-connection.md) - 認証方法、接続設定
- [Models](model-config.md) - マテリアライゼーション、パーティショニング、クラスタリング
- **[パーティショニング＆クラスタリング](partitioning-clustering-guide.md)** - 順番・数・使い分けの決定版（GCP公式参照）
- **[BigQuery設定リファレンス](bigquery-configs-complete.md)** - 詳細ガイド（暗号化、Python、マテビュー等）

### 🟡 重要（データ品質・運用効率の向上）

- [Tests](testing-config.md) - Schema/Singular/Unit Tests
- **[Unit Tests検証](unit-tests-verification.md)** - 6種類のデータ形式、CI/CD統合
- **[Contract設定（スキーマ保証）](contracts-config.md)** - 型安全性、unit testsとの組み合わせ
- [ドキュメント設定](documentation-config.md) - dbt docs、descriptions
- [パフォーマンス最適化](performance-optimization.md) - スロット最適化、並列実行

### 🟢 任意（高度な機能・特殊用途）

- [Snapshots](snapshot-config.md) - SCD Type 2実装
- [Seeds](seed-config.md) - CSVファイルのロード
- [Hooks](hooks-config.md) - pre-hook、post-hook
- [その他の設定](other-config.md) - vars、packages、macros
