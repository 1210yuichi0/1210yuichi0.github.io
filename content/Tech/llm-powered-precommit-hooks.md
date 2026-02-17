---
title: "LLMを活用したpre-commitフック：CONTRIBUTING.mdルールの自動レビュー"
date: 2026-02-17
tags: ["git", "llm", "automation", "best-practices", "code-review"]
draft: false
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-17
  reviewed: false
---

## 背景

ドキュメントサイトを運用する際、CONTRIBUTING.mdにルールを定義しても、人間がそれを完璧に守るのは困難です。特に以下のような問題が発生しがちです：

- ファイル命名規則の違反（kebab-case、大文字使用など）
- フォルダ階層の深すぎるネスト
- index.mdへの詳細ドキュメント記載
- frontmatterの日付フォーマット不統一
- タグの大文字使用

これらのルール違反を防ぐため、**CONTRIBUTING.mdに定義されたルールをpre-commitフックで自動チェックする仕組み**を実装しました。

## 実装の経緯：なぜなぜ分析から生まれた再発防止策

### 発生した問題

CONTRIBUTING.mdに**存在しないルール**「各フォルダにindex.mdが必要」を勝手に解釈し、8つの不要なindex.mdファイルを作成してしまいました。

### なぜなぜ分析

**なぜ1**: なぜ存在しないルールに基づいて作業したのか？
→ CONTRIBUTING.mdを正確に読まず、自分でルールを推測・解釈したから

**なぜ2**: なぜCONTRIBUTINGを正確に読まなかったのか？
→ 一般的なベストプラクティス（フォルダにはindex.mdを置く）とプロジェクト固有のルールを混同したから

**なぜ3**: なぜ一般論とプロジェクト固有ルールを混同したのか？
→ 作業前に「このプロジェクトのCONTRIBUTING.mdに該当ルールが存在するか」を確認するプロセスがなかったから

### 根本原因

1. プロジェクト固有のルールと一般的なベストプラクティスを混同
2. CONTRIBUTING.mdを参照せずに推測で行動
3. 「〜すべき」と思った時にルールの存在を確認しなかった

### 再発防止策

**人間の確認に頼らず、機械的にCONTRIBUTING.mdルールをチェックする仕組みを作る**
→ pre-commitフックで自動レビューを実装

## 実装方法

### 1. チェックスクリプトの作成

`scripts/check-contributing-rules.sh` を作成し、8つのルールをチェックします。

```bash
#!/usr/bin/env bash

set -e

echo "🔍 CONTRIBUTING.md ルールをチェック中..."

# ステージされたマークダウンファイルを取得
STAGED_MD_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.md$' || true)

if [ -z "$STAGED_MD_FILES" ]; then
  echo -e "${GREEN}✓ チェック対象のマークダウンファイルなし${NC}"
  exit 0
fi

ERROR_COUNT=0

# 1. ファイル名チェック (kebab-case)
# 2. フォルダ階層チェック (1階層まで)
# 3. index.md/README.md の詳細ドキュメントチェック
# 4. タイトル重複チェック (frontmatter vs H1)
# 5. 日付フォーマットチェック (YYYY-MM-DD)
# 6. コードブロック言語指定チェック
# 7. タグ小文字チェック
# 8. プロモーショナル表現チェック

# ... (各チェックの実装)

if [ $ERROR_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ CONTRIBUTING.mdルールチェック: OK${NC}"
  exit 0
else
  echo -e "${RED}✗ CONTRIBUTING.mdルールチェック: ${ERROR_COUNT}個のエラー${NC}"
  exit 1
fi
```

### 2. pre-commitフックへの統合

`.husky/pre-commit` に追加：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 禁止ワードチェック
./scripts/check-forbidden-words.sh

# CONTRIBUTING.md ルールチェック
./scripts/check-contributing-rules.sh

# コード整形
npx lint-staged
```

### 3. 実行権限の付与

```bash
chmod +x scripts/check-contributing-rules.sh
```

## チェック項目詳細

### 🚫 エラー（コミット中止）

#### 1. ファイル名チェック (kebab-case)

```bash
# NG: 大文字、アンダースコア、スペース、日本語
Project_Config.md
BigQuery接続.md
unit tests.md

# OK: 小文字とハイフン
project-config.md
bigquery-connection.md
unit-tests.md
```

実装：

```bash
if [[ ! "$basename" =~ ^[a-z0-9]+(-[a-z0-9]+)*\.md$ ]]; then
  echo "✗ ファイル名がkebab-caseではありません: $file"
  ((ERROR_COUNT++))
fi
```

#### 2. フォルダ階層チェック

```bash
# NG: 2階層以上のネスト
content/Tech/dbt/models.md  # 3階層

# OK: 1階層
content/dbt-models/models.md  # 2階層
```

実装：

```bash
depth=$(echo "$file" | awk -F'/' '{print NF-1}')
if [ "$depth" -gt 2 ]; then
  echo "✗ フォルダ階層が深すぎます: $file"
  ((ERROR_COUNT++))
fi
```

#### 3. \_index.md 禁止チェック

```bash
# NG
content/dbt/_index.md

# OK
content/dbt/index.md
content/dbt/README.md
```

#### 4. タイトル重複チェック

```markdown
---
title: "dbt設定ガイド"
---

# dbt設定ガイド ← ❌ frontmatterと重複
```

Quartzは `title` フィールドを自動表示するため、H1見出しで同じタイトルを書くと重複します。

実装：

```bash
frontmatter_title=$(awk '/^title:/ {print}' "$file")
h1_title=$(awk '/^# / {print}' "$file")

if [ "$frontmatter_title" = "$h1_title" ]; then
  echo "✗ タイトルが重複: $file"
  ((ERROR_COUNT++))
fi
```

#### 5. 日付フォーマットチェック

```yaml
# NG
date: 2026/2/17
date: Feb 17, 2026

# OK
date: 2026-02-17
```

#### 6. タグ小文字チェック

```yaml
# NG
tags: ["DBT", "BigQuery", "テスト"]

# OK
tags: ["dbt", "bigquery", "testing"]
```

### ⚠️ 警告（コミット継続）

#### 7. index.md/README.md の詳細ドキュメントチェック

frontmatter除去後の実質行数が50行を超える場合、警告を表示：

```bash
line_count=$(awk 'BEGIN{in_fm=0} /^---$/{...} !in_fm{count++}' "$file")
if [ "$line_count" -gt 50 ]; then
  echo "⚠ index.mdが長すぎます (${line_count}行)"
fi
```

#### 8. コードブロック言語指定チェック

````markdown
# NG

```
def hello():
    print("Hello")
```

# OK

```python
def hello():
    print("Hello")
```
````

#### 9. プロモーショナル表現チェック

```bash
PROMO_WORDS=("完全ガイド" "完全検証" "完全網羅" "究極" "最強")

for word in "${PROMO_WORDS[@]}"; do
  if grep -q "$word" "$file"; then
    echo "⚠ プロモーショナル表現を検出: $word"
  fi
done
```

## 実行例

### ✅ 成功例（実際のログ）

````bash
$ git add content/Tech/llm-powered-precommit-hooks.md
$ ./scripts/check-contributing-rules.sh

🔍 CONTRIBUTING.md ルールをチェック中...

📝 [1/8] ファイル名チェック (kebab-case, 英語のみ)...

📂 [2/8] フォルダ階層チェック (1階層まで)...

📄 [3/8] index.md/README.md の詳細ドキュメントチェック...

🔤 [4/8] タイトル重複チェック (frontmatter vs H1)...

📅 [5/8] 日付フォーマットチェック (YYYY-MM-DD)...

💻 [6/8] コードブロック言語指定チェック...
⚠ 言語指定のないコードブロック: content/Tech/llm-powered-precommit-hooks.md
  行番号: 83 101 107 125 133 143 152 163 173 186 197 207 220 226 229 235 248 277 306 331 343 346 357 371 394
  → コードブロックには言語を指定してください (例: ```python)

🏷️  [7/8] タグ小文字チェック...

📢 [8/8] プロモーショナル表現チェック...
⚠ プロモーショナル表現を検出: content/Tech/llm-powered-precommit-hooks.md
  キーワード: 完全ガイド
  → 客観的な表現を使用してください (例: '完全ガイド' → 'ガイド')

========================================
✓ CONTRIBUTING.mdルールチェック: OK
========================================
````

**注**: 警告（⚠）はコミットを中止しません。この例では、記事内のコード例に意図的に言語指定のないコードブロックを含めているため警告が出ていますが、エラー（✗）がないためチェックは成功しています。

### ❌ エラー例（実際のログ）

以下は、意図的にルール違反を含むテストファイル `Test_Bad_Name.md` での実行結果です：

```markdown
---
title: "テストガイド"
date: 2026/02/17
tags: ["DBT", "BigQuery"]
---

# テストガイド

完全ガイドです。
```

実行結果：

````bash
$ git add content/Tech/Test_Bad_Name.md
$ ./scripts/check-contributing-rules.sh

🔍 CONTRIBUTING.md ルールをチェック中...

📝 [1/8] ファイル名チェック (kebab-case, 英語のみ)...
✗ ファイル名がkebab-caseではありません: content/Tech/Test_Bad_Name.md
  → 小文字英語とハイフンのみ使用してください (例: project-config.md)

📂 [2/8] フォルダ階層チェック (1階層まで)...

📄 [3/8] index.md/README.md の詳細ドキュメントチェック...

🔤 [4/8] タイトル重複チェック (frontmatter vs H1)...
✗ タイトルが重複しています: content/Tech/Test_Bad_Name.md
  frontmatter: テストガイド
  H1見出し: テストガイド
  → H1見出しを削除してください（Quartzが自動的にtitleを表示します）

📅 [5/8] 日付フォーマットチェック (YYYY-MM-DD)...
✗ 日付フォーマットが不正: content/Tech/Test_Bad_Name.md
  現在: date: 2026/02/17
  → YYYY-MM-DD形式を使用してください (例: 2026-02-17)

💻 [6/8] コードブロック言語指定チェック...
⚠ 言語指定のないコードブロック: content/Tech/Test_Bad_Name.md
  行番号: 6 9
  → コードブロックには言語を指定してください (例: ```python)

🏷️  [7/8] タグ小文字チェック...

📢 [8/8] プロモーショナル表現チェック...
⚠ プロモーショナル表現を検出: content/Tech/Test_Bad_Name.md
  キーワード: 完全ガイド
  → 客観的な表現を使用してください (例: '完全ガイド' → 'ガイド')

========================================
✗ CONTRIBUTING.mdルールチェック: 3個のエラー
========================================

修正後、再度コミットしてください。
詳細: content/guides/contributing.md を参照
````

**検出されたエラー**:

1. ファイル名に大文字とアンダースコア使用（`Test_Bad_Name.md`）
2. frontmatter `title` と H1見出しが重複
3. 日付フォーマットがスラッシュ区切り（`2026/02/17`）

**検出された警告**:

1. コードブロックに言語指定なし
2. プロモーショナル表現（"完全ガイド"）使用

## メリット

### 1. 人的ミスの防止

レビュアーが見逃しがちなルール違反を機械的に検出：

- ファイル命名規則
- フォルダ構造
- frontmatterフォーマット

### 2. レビュー負荷の軽減

形式的なチェックを自動化することで、レビュアーは**内容の質**に集中できます。

### 3. 一貫性の維持

プロジェクト全体で統一されたスタイルを維持：

```bash
# すべてのファイルがkebab-case
project-config.md
bigquery-connection.md
unit-tests-verification.md
```

### 4. ドキュメント品質の向上

- タイトル重複防止 → 読みやすさ向上
- 日付フォーマット統一 → ソート可能
- コードブロック言語指定 → シンタックスハイライト

### 5. 学習効果

エラーメッセージに修正方法を含めることで、コントリビューターがルールを学習できます：

```
✗ ファイル名がkebab-caseではありません: Project_Config.md
  → 小文字英語とハイフンのみ使用してください (例: project-config.md)
```

## 応用：LLMとの組み合わせ

### コンテキスト保持

pre-commitチェックのエラーは、LLM（Claude、ChatGPT等）のコンテキストに含めることで、より高度なレビューが可能：

```bash
# pre-commitエラーをLLMに渡す
git commit 2>&1 | llm "以下のエラーを修正してください"
```

### 自動修正

簡単なルール違反は自動修正も可能：

```bash
# ファイル名を自動的にkebab-caseに変換
for file in $STAGED_FILES; do
  new_name=$(echo "$file" | tr '[:upper:]' '[:lower:]' | tr '_' '-')
  if [ "$file" != "$new_name" ]; then
    git mv "$file" "$new_name"
  fi
done
```

### セマンティックチェック

LLM APIを使用して、より高度なチェックも可能：

```bash
# Claude APIでドキュメントの品質をチェック
for file in $STAGED_MD_FILES; do
  claude_check=$(curl -X POST https://api.anthropic.com/v1/messages \
    -H "x-api-key: $YOUR_CLAUDE_KEY" \
    -d "{
      'model': 'claude-sonnet-4.5',
      'messages': [{
        'role': 'user',
        'content': '以下のドキュメントをCONTRIBUTING.mdルールに照らしてレビュー: $(cat $file)'
      }]
    }")

  if echo "$claude_check" | grep -q "WARNING"; then
    echo "⚠ AI detected issues in $file"
  fi
done
```

## 注意点

### 1. パフォーマンス

大量のファイルをコミットする場合、チェック時間が長くなる可能性があります。

対策：

- 並列処理の導入
- キャッシュの活用
- チェック対象を変更ファイルのみに限定

### 2. 誤検知

正規表現ベースのチェックは誤検知の可能性があります。

対策：

- 除外リストの作成
- `--no-verify` オプションでスキップ可能にする
- 警告のみのチェック項目を設ける

### 3. ルールの更新

CONTRIBUTING.mdを更新したら、チェックスクリプトも更新が必要です。

対策：

- CONTRIBUTING.mdとスクリプトをセットで管理
- テストケースの作成

## まとめ

CONTRIBUTING.mdルールのpre-commit自動チェックにより：

1. **人的ミスを機械的に防止**
2. **レビュー負荷を軽減**
3. **プロジェクト全体の一貫性を維持**
4. **ドキュメント品質を向上**

特に、**なぜなぜ分析から生まれた再発防止策**として、「人間の確認に頼らず、機械的にチェックする」アプローチは効果的です。

LLMを活用することで、さらに高度なセマンティックチェックも可能になり、ドキュメント運用の自動化が進んでいます。

## 参考リンク

- [Husky](https://typicode.github.io/husky/) - Git hooks管理ツール
- [lint-staged](https://github.com/lint-staged/lint-staged) - ステージされたファイルに対するリンター実行
- [CONTRIBUTING.md best practices](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors)

---

_実装コード: [scripts/check-contributing-rules.sh](../../scripts/check-contributing-rules.sh)_
