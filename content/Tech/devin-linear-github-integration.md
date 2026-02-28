---
title: Devin + Linear + GitHub 連携の比較調査
draft: false
tags:
  - devin
  - linear
  - github
  - ai-agent
date: 2026-02-28
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.6
  date: 2026-02-28
  reviewed: false
---

Devin（AI ソフトウェアエンジニア）と Linear・GitHub それぞれとの連携機能を調査し、Linear の機能が GitHub で代替できるかを検証した記録。

## TL;DR

- **Devin + Linear** はネイティブ統合により、Issue 起票 → 自動トリガー → PR 生成 → ステータス更新がシームレスに連動
- **Devin + GitHub** は PR 管理・コード操作には強いが、Issue からの自動トリガーは GitHub Actions + Devin API の手動構築が必要
- **GitHub だけでの完全再現は困難**。特に「自動トリガー・自動ステータス更新・プレイブックによるワークフロー制御」は Linear 独自の強み

---

## Devin + Linear 連携機能

### トリガー方法（3パターン）

| 方法       | 操作                                    | 挙動                         |
| ---------- | --------------------------------------- | ---------------------------- |
| アサイン   | Linear の Issue に Devin をアサイン     | デフォルトプレイブックで起動 |
| ラベル     | `!plan` `!implement` などのラベルを付与 | 対応するプレイブックが実行   |
| メンション | コメントで `@Devin` + 指示を記入        | プレイブックなしで即時実行   |

バルク操作も可能で、`Cmd+A` で複数チケットを選択して Devin ラベルを一括付与できる。

### 自動ステータス更新

Devin が作業を進めると Linear のチケットステータスが自動更新される：

```
In Progress → In Review → Done
```

人手でのステータス変更が不要になり、プロジェクトボードが常に最新状態を反映する。

### PR と Issue の自動リンク

Devin セッション内で作成した PR は、起点となった Linear Issue に**自動リンク**される。手動で紐付ける操作は不要。

### リアルタイム進捗の可視性

- 実行コマンド・編集ファイルをコメントにリアルタイム投稿
- タスクリストの進捗を Linear 上で確認可能
- Devin セッションへのリンクが自動添付

### プレイブックによるワークフロー制御

Devin のプレイブック（再利用可能な手順書）と Linear のラベルを組み合わせることで、定型タスクを自動化できる。例：

- `!plan` ラベル → スコーピング + 実装計画のみ実施
- `!implement` ラベル → 計画からPR作成まで実施
- 特定チーム・ステータス遷移でのみ Devin を自動起動する条件設定

### 信頼度インジケータ

Devin は提案内容に 🔴🟠🟢 の信頼度を添付して投稿。「この実装に自信あり/なし」がチケット上で一目でわかる。

### Linear Knowledge との連携

Devin は過去のチケット・PR から学習し、Linear Knowledge（ナレッジベース）を自動生成。スコーピングの精度が継続的に向上する。

---

## Devin + GitHub 連携機能

### PR 管理（ネイティブ対応）

| 機能            | 詳細                                          |
| --------------- | --------------------------------------------- |
| PR 作成         | Devin がブランチをプッシュし PR を自動作成    |
| PR コメント応答 | PR コメントへの自動返信（セッション有効中）   |
| PR テンプレート | `devin_pr_template.md` をサポート             |
| コードレビュー  | Devin API + GitHub Actions で自動 PR レビュー |

### リポジトリ操作

- ブランチプッシュ・コミット
- Issue のオープン
- ディスカッション参加
- Dependabot アラートの解決支援
- GPG 署名対応

### アクセス制御

全リポジトリまたは特定リポジトリのみへのアクセスを設定可能。ブランチ保護ルールとの併用を推奨。

### Issue からの自動トリガー（手動構築が必要）

GitHub Issues からDevin を自動起動するには **GitHub Actions + Devin API** の手動構築が必要：

```yaml
# .github/workflows/devin-review.yml
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  devin-review:
    runs-on: ubuntu-latest
    env:
      DEVIN_TOKEN: ${{ vars.DEVIN_TOKEN }}
    steps:
      - name: Trigger Devin
        run: |
          curl -X POST \
            -H "Authorization: Bearer $DEVIN_TOKEN" \
            -d "{\"prompt\": \"...\"}" \
            "https://api.devin.ai/v1/sessions"
```

この仕組みにより以下が実現可能：

- PR オープン時に自動レビュー
- Issue 作成時に Devin を自動起動（Webhook 経由）

---

## 比較：Devin + Linear vs Devin + GitHub

### 機能比較表

| 機能                       | Linear                 | GitHub Issues       | 備考                                     |
| -------------------------- | ---------------------- | ------------------- | ---------------------------------------- |
| Issue → Devin 自動トリガー | ✅ ネイティブ          | ⚠️ Actions 手動構築 | Linear は設定のみで有効                  |
| アサイン起動               | ✅                     | ❌                  | Linear 独自                              |
| ラベル起動                 | ✅（プレイブック連動） | ⚠️ API 手動構築     | Linear はラベル種別でワークフロー分岐可  |
| @メンション起動            | ✅                     | ❌                  | Linear 独自                              |
| 自動ステータス更新         | ✅                     | ❌                  | GitHub Projects では手動 or Actions 構築 |
| PR と Issue の自動リンク   | ✅                     | ⚠️ Closes #123 記法 | Linear は Devin セッションが自動リンク   |
| リアルタイム進捗表示       | ✅（コメント投稿）     | ❌                  | GitHub は PR コメントのみ                |
| バルクアサイン             | ✅                     | ❌                  | Linear の複数選択機能                    |
| プレイブック連動           | ✅                     | ❌                  | Linear のラベル = Devin の手順書指定     |
| 信頼度インジケータ         | ✅（Linear コメント）  | ✅（PR コメント）   | GitHub でも PR レビューとして確認可      |
| PR 作成                    | ✅                     | ✅                  | 両方ネイティブ対応                       |
| コードレビュー             | ✅                     | ✅                  | 両方対応                                 |
| リポジトリアクセス制御     | ✅                     | ✅                  | 同等                                     |

### なぜ Devin + Linear がシームレスなのか

**Linear 側の設計思想**として、AI エージェントをチームメンバーとして扱う仕組みがある：

- エージェントを Issue にアサインすると、**人間が主担当・エージェントがコントリビューター**として登録される（責任の所在が明確）
- 複数 Issue への同時アサインと並列処理に対応
- ステータス遷移・チーム・ラベルを条件にした自動起動ルール設定が GUI のみで完結

**GitHub の制約**：

- GitHub Issues はコード管理ツールに付属した Issue トラッカーであり、AI エージェント向けのネイティブ統合設計ではない
- 自動化は GitHub Actions + Devin API という別レイヤーの組み合わせが必要
- セットアップ・メンテナンスコストが高い

---

## GitHub だけで Linear の機能を再現できるか

### 再現可能な機能

| Linear 機能                | GitHub での再現方法                  |
| -------------------------- | ------------------------------------ |
| Issue → PR 作成            | ✅ Devin が GitHub PR を直接作成可能 |
| PR コメントで Devin に指示 | ✅ ネイティブ対応                    |
| コードレビュー自動化       | ✅ GitHub Actions + Devin API        |
| Dependabot 解決            | ✅ Devin が対応可能                  |

### 再現困難・不可能な機能

| Linear 機能                                   | 再現困難な理由                                               |
| --------------------------------------------- | ------------------------------------------------------------ |
| Issue アサインで自動トリガー                  | GitHub Actions の手動構築が必要（Webhook + API 連携）        |
| `!plan` `!implement` ラベルでワークフロー分岐 | GitHub Labels は Devin プレイブックと連動しない              |
| チケットステータスの自動更新                  | GitHub Projects は自動化が限定的、手動 Actions が必要        |
| @Devin メンションで即時起動                   | GitHub Issues のメンションは Devin に届かない                |
| Devin セッション ↔ Issue の自動リンク         | PR の `Closes #123` 記法で部分的に代替可能だが、自動ではない |
| バルクアサイン                                | GitHub には複数 Issue への同時アサイン UI がない             |
| リアルタイム進捗コメント                      | GitHub PR コメントのみで、Issue には自動投稿されない         |
| プレイブック + ラベル連動                     | Linear 固有のアーキテクチャ                                  |

### 結論

**GitHub のみでは Devin + Linear の体験を完全再現することは現実的ではない。**

特に「Issue 起票から PR 生成までのシームレスなパイプライン」は Linear のネイティブ統合があってこそ実現している。GitHub でも不可能ではないが、GitHub Actions + Devin API の自前構築・メンテナンスが必要になる。

---

## まとめ：どのツール構成を選ぶべきか

| チームの状況                    | 推奨構成                                                    |
| ------------------------------- | ----------------------------------------------------------- |
| 既に Linear を使っている        | **Devin + Linear + GitHub**（最もシームレス）               |
| GitHub 中心でコード管理したい   | **Devin + GitHub**（PR 管理は十分。Issue 自動化は割り切る） |
| Issue → PR のフルオートを求める | **Linear 必須**（GitHub だけでは再現困難）                  |
| 小規模・シンプルなフロー        | **Devin + GitHub**（Linear の学習コストなしで始められる）   |

---

## 参照元

- [Devin Integration – Linear](https://linear.app/integrations/devin)
- [Linear - Devin Docs](https://docs.devin.ai/integrations/linear)
- [GitHub - Devin Docs](https://docs.devin.ai/integrations/gh)
- [Linear for Agents](https://linear.app/agents)
- [Devin 101: Automatic PR Reviews with the Devin API – Cognition](https://cognition.ai/blog/devin-101-automatic-pr-reviews-with-the-devin-api)
- [Devin 2.2: Desktop and Code Review AI Guide](https://www.digitalapplied.com/blog/devin-2-desktop-code-review-ai-engineer-guide)
