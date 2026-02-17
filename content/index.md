---
title: Scrap Notes
date: 2026-02-18
authorship:
  type: human-written
  reviewed: false
---

日々の学びや気づきをスクラップ的にメモしていく場所です。

技術検証、実装ガイド、学習記録を中心に、実務で役立つ知見を蓄積しています。

[[about|About →]]

---

## 📂 コンテンツカテゴリ

### 🛠️ dbt + BigQuery

データ基盤構築・運用に関する実践的なガイドと検証レポート。

- **[dbt概要](dbt/overview.md)** - dbt + BigQueryのエコシステム
- **接続設定** - プロジェクト設定、BigQuery認証
- **モデル開発** - マテリアライゼーション、パーティショニング、クラスタリング
- **テスト** - Unit Tests、Generic Tests、データ品質検証
- **パフォーマンス** - 増分処理、Snapshot、最適化手法
- **高度な機能** - Python UDF、カスタムマクロ、Hooks

### 💻 Tech

技術メモ、ツール設定、ベストプラクティス。

- [Gitメモ](Tech/git-memo.md) - Git操作、GitHub運用、複数アカウント管理
- [LLMを活用したpre-commitフック](Tech/llm-powered-precommit-hooks.md) - AI駆動の品質チェック
- [Markdownガイド](Tech/markdown-guide.md) - 記法リファレンス
- [禁止ワードチェック](Tech/pre-commit-forbidden-words.md) - セキュリティ対策

### 💡 Ideas

アイデア・提案・実装プラン。

- [dbt増分設定のCI/CD自動チェック](Ideas/dbt-incremental-config-ci-check.md) - 品質保証の自動化

### 📖 個人情報保護法

法律解釈、実務での判断基準、コンプライアンス対応。

- [個人情報と個人関連情報の違い](個人情報保護法/個人情報と個人関連情報の違い.md) - 法的定義と実務での判断基準
- [概要](個人情報保護法/概要.md) - 試験対策・章別解説

### 📝 Notes

一般的な学習メモ、読書記録。

- （準備中）

---

## 🎯 特集記事

### 最近の更新

- **[個人情報と個人関連情報の違い](個人情報保護法/個人情報と個人関連情報の違い.md)** (2026-02-17)
  - 法的定義、実務での判断基準、Cookie・位置情報の扱い方

- **[BigQuery Python UDFでないと不可能なこと](dbt-bigquery/bigquery-python-udf-deep-dive.md)** (2026-02-17)
  - レーベンシュタイン距離、Luhn、HMAC、UUID v5、Base64デコード

- **[LLMをpre-commitで実行する](Tech/llm-powered-precommit-hooks.md)** (2026-02-17)
  - Claude APIを活用した自動コードレビュー、実行ログ付き

---

## 🔧 このサイトについて

### 特徴

- **Quartz v4.5.2** - 高速な静的サイトジェネレーター
- **GitHub Pages** - 自動デプロイ
- **Obsidian連携** - ローカルで編集、自動公開
- **AI支援** - Claude Sonnet 4.5による技術記事作成
- **品質管理** - pre-commitフック、禁止ワードチェック、ルール自動検証

### ワークフロー

```bash
# ローカルプレビュー
make serve

# GitHubに公開（約1-2分で反映）
make publish
```

### コントリビューション

記事作成ルールは [CONTRIBUTING.md](guides/contributing.md) を参照してください。

---

## 📊 統計情報

- **記事数**: 40+
- **カテゴリ**: 5つ
- **タグ**: dbt, bigquery, python, testing, best-practices, etc.
- **最終更新**: 2026-02-18

---

Built with [Quartz](https://quartz.jzhao.xyz/) | Powered by [Claude Sonnet 4.5](https://claude.ai)
