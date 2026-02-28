# GitHub Copilot Instructions

このリポジトリは **Quartz v4.5.2** で構築された日本語技術ブログです。
コンテンツは `content/` 配下の Markdown ファイルとして管理されます。

## pre-commit CI が自動チェックする項目（Copilot はスキップ可）

以下の項目は `husky` + `lint-staged` による pre-commit フックで自動検出・修正されます。
コードレビューでこれらを重複指摘する必要はありません。

| チェック項目                                   | ツール                        | 対象              |
| ---------------------------------------------- | ----------------------------- | ----------------- |
| ファイル名が kebab-case・英語のみ              | `check-contributing-rules.sh` | `content/**/*.md` |
| フォルダ階層が `content/xxx/` の1階層まで      | `check-contributing-rules.sh` | `content/**/*.md` |
| frontmatter `title` と H1 見出しの重複         | `check-contributing-rules.sh` | `content/**/*.md` |
| frontmatter `date` の YYYY-MM-DD 形式          | `check-contributing-rules.sh` | `content/**/*.md` |
| frontmatter `tags` が小文字のみ                | `check-contributing-rules.sh` | `content/**/*.md` |
| 機密情報ワード（認証情報・個人名・社内用語等） | `check-forbidden-words.sh`    | 全ファイル        |
| Markdown フォーマット                          | Prettier                      | `**/*.md`         |

以下は **警告のみ**（エラーにならない）のチェック項目です：

- コードブロックに言語指定がない（例：` ``` ` のみ）
- `index.md` / `README.md` が50行超（詳細ドキュメントの疑い）
- プロモーショナル表現（「完全ガイド」「究極」等）

## Copilot がフォーカスすべきレビュー観点

- **内容の正確性**：技術的な事実・情報の誤りや古い情報
- **論理構成**：セクションの流れ・説明の順序が適切か
- **参照元の妥当性**：リンク切れ・信頼性の低いソース
- **日本語表現**：不自然な文体・誤字脱字・敬体/常体の混在

## リポジトリ固有の規約

- コミットメッセージは**日本語**（Conventional Commits 形式）
- `content/` 配下は1階層まで（`content/xxx/yyy/` は禁止）
- frontmatter の `authorship.type: ai-assisted` は AI 補助で作成したことを示す（削除不要）
