---
title: CI チェック結果を PR description に出力すべきか（AIレビュアー向けコンテキスト観点）
draft: false
tags:
  - ci-cd
  - github-actions
  - ai-review
  - pull-request
date: 2026-02-28
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.6
  date: 2026-02-28
  reviewed: false
---

「CI でチェックした項目を PR description に出力すると、AI レビュアーへの有効なコンテキストになるか」を調査した記録。

## TL;DR

- **条件付き有益**。ただし PR description への書き込みより `copilot-instructions.md` への記載の方が効果的
- CI が通過済みの項目を明示することで「AI が CI カバー済みの問題を重複指摘する」無駄を防げる
- PR description への書き込みは「競合リスク」があるため、専用 PR コメントへの投稿の方が安全

---

## AIレビュアーが参照するコンテキスト

### GitHub Copilot Code Review

Copilot のコードレビューが参照する情報源：

| 情報源                               | 参照可否 | 備考                                       |
| ------------------------------------ | -------- | ------------------------------------------ |
| リポジトリ全体（diff 含む）          | ✅       | セマンティック関連ファイルを選択的に取得   |
| PR description（本文）               | ✅       | 読む。クリティカルな制約はここに書くと有効 |
| `.github/copilot-instructions.md`    | ✅       | **最も効果的**なカスタマイズ手段           |
| PR コメント                          | ✅       | `@github-copilot` でタグ付けすれば対話可能 |
| CI check status（GitHub Checks API） | ❌       | GitHub ホスト環境では外部 MCP ツール不可   |
| Jira / Linear / Slack                | ❌       | 外部ツールは PR 環境から参照不可           |

**重要な制約**：Copilot の PR レビューは GitHub のホスト環境で動作し、外部 MCP サーバーへのアクセスがない。CI の check status API は読まない。

### Devin

Devin は PR description・コメントを読みながらレビューするが、「CI が何を確認したか」を PR description から読み取ってコンテキストにする。

### CodeRabbit

リポジトリ全体・PR description・diff を読む。さらに 40+ の静的解析ツールを自前で実行するため、CI 結果よりも「自前の解析」を優先する。

---

## CI 結果を PR description に書くことの有効性

### 有益なケース

**「AI が CI 済み問題を重複指摘する」のを防ぐ**

例：CI がフォーマット・禁止ワード・ルール違反をすでにチェック済みなのに、Copilot が同じ観点でコメントする無駄が発生しうる。PR description または `copilot-instructions.md` に「以下は CI チェック済み」と明示することで防げる。

```markdown
## CI チェック済み項目（AIレビュアーはスキップ可）

- ✅ 禁止ワードチェック（pre-commit）
- ✅ フォーマット（Prettier）
- ✅ CONTRIBUTING.md ルール準拠
```

**構造化した PR description はレビュー時間を短縮する**

AI コーディングエージェントの PR 説明を研究した論文（arxiv 2602.17084）によると、Markdown ヘッダー・リスト項目で構造化された PR description ほどレビュアーのレスポンス時間が短く、完了が早い傾向。

### 限定的・無益なケース

**「チェック通過しました」の列挙だけでは意味が薄い**

「✅ CI passed」という情報だけでは AI レビュアーへのコンテキストとして不十分。重要なのは「何を・なぜチェックしているか」の説明。

**CodeRabbit には効果が薄い**

CodeRabbit は自前で 40+ のツールを実行するため、「CI が通過済み」という情報は参考程度にしかならない。

---

## より効果的なアプローチ：`copilot-instructions.md` に書く

PR description への書き込みより、リポジトリの `.github/copilot-instructions.md` に CI カバー範囲を記載する方が確実かつ永続的：

```markdown
## CIが自動チェックする項目（コードレビューでの重複指摘は不要）

- フォーマット（Prettier）
- 禁止ワード（日本語チェック）
- ファイル命名規則（kebab-case）
- コードブロックの言語指定
  これらは pre-commit および GitHub Actions CI で自動検出・修正されます。
```

**メリット**：

- 全 PR に自動適用（毎回書く必要なし）
- PR description を汚さない
- Copilot の挙動を永続的にコントロールできる

---

## PR description への書き込みのコスト・デメリット

| デメリット           | 詳細                                                       |
| -------------------- | ---------------------------------------------------------- |
| 競合リスク           | 人間が手動編集した部分を GitHub Actions が上書きする可能性 |
| description が長大化 | 可読性が下がり、人間レビュアーが本質を見失う               |
| メンテナンスコスト   | GitHub Actions ワークフロー追加・管理が必要                |
| 陳腐化               | CI の内容が変わっても description は更新されない           |

---

## 実装パターン（もし書くなら）

### パターン A：PR description の末尾に固定セクション

GitHub Actions で PR description の末尾に固定ブロックを追加：

```yaml
- name: Update PR description with CI results
  uses: nefrob/pr-description@v1
  with:
    content: |
      ## CI チェック結果
      - ✅ 禁止ワードチェック: 通過
      - ✅ Prettier フォーマット: 通過
      - ✅ CONTRIBUTING.md ルール: 通過
    token: ${{ github.token }}
    append: true # 末尾追記（上書きしない）
```

### パターン B：専用 PR コメントに投稿（推奨）

description を汚さず、コメントとして投稿：

```yaml
- name: Post CI summary as PR comment
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `## CI チェックサマリー\n- ✅ 禁止ワード\n- ✅ フォーマット\n- ✅ CONTRIBUTING.md ルール`
      })
```

---

## 結論：何をすべきか

| やること                                         | 優先度 | 理由                               |
| ------------------------------------------------ | ------ | ---------------------------------- |
| `copilot-instructions.md` に CI カバー範囲を明記 | **高** | 全 PR に永続的に適用。最も効果的   |
| PR description への CI 結果書き込み              | **低** | 競合リスクあり。コスト対効果が低い |
| CI 結果を専用コメントに投稿                      | **中** | description を汚さず、AIが参照可能 |

**このリポジトリへの推奨**：まず `.github/copilot-instructions.md` を作成し、pre-commit が担うチェック項目（禁止ワード・フォーマット・CONTRIBUTING.md ルール）を「AI レビュー不要」として明示する。

---

## 参照元

- [About GitHub Copilot code review – GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/code-review)
- [How AI Coding Agents Communicate: PR Description Characteristics – arxiv](https://arxiv.org/html/2602.17084v1)
- [How I Taught GitHub Copilot Code Review to Think Like a Maintainer – DEV Community](https://dev.to/techgirl1908/how-i-taught-github-copilot-code-review-to-think-like-a-maintainer-3l2c)
- [Update PR Description – GitHub Actions Marketplace](https://github.com/marketplace/actions/update-pr-description)
- [CodeRabbit – AI Code Reviews](https://docs.coderabbit.ai/)
