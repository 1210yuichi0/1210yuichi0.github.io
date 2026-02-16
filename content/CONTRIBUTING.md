---
title: コンテンツ作成ガイドライン
draft: false
tags:
  - guide
  - rules
date: 2026-02-16
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-16
  reviewed: false
---

このサイトのコンテンツを作成する際のガイドラインです。

## ⚠️ 重要なルール

### タイトルの重複を避ける

**❌ ダメな例**:

```markdown
---
title: Gitメモ
---

# Gitメモ

内容...
```

**✅ 良い例**:

```markdown
---
title: Gitメモ
---

内容...
```

**理由**: Quartzは`title`フィールドを自動的にページタイトルとして表示するため、H1見出しで同じタイトルを書くと重複します。

### タイトル重複チェック方法

以下のコマンドでタイトル重複をチェックできます：

```bash
# 全ファイルのタイトル重複をチェック
grep -r "^title: " content/ | while IFS=: read -r file title; do
  # ファイル内でタイトルと同じH1見出しがあるかチェック
  echo "Checking $file"
done
```

## 📝 Frontmatter設定

### 基本構造

```yaml
---
title: ページタイトル
draft: false # 下書きの場合はtrue
tags:
  - タグ1
  - タグ2
date: 2026-02-16
---
```

### Authorship（著作権情報）

AI支援で作成した記事には必ず記載：

```yaml
authorship:
  type: ai-assisted # または human-written, ai-generated
  model: Claude Sonnet 4.5
  date: 2026-02-16
  reviewed: false # レビュー済みの場合はtrue
```

**Type の種類**:

- `human-written`: 完全に人間が書いた
- `ai-assisted`: AIアシスタントの支援を受けた
- `ai-generated`: AIが生成した（最小限の編集のみ）

## 📂 フォルダ構成

```
content/
├── index.md              # トップページ
├── about.md              # Aboutページ
├── Tech/                 # 技術関連の記事
├── Notes/                # 一般的なノート・メモ
└── CONTRIBUTING.md       # このファイル
```

### フォルダの用途

| フォルダ | 用途                       | 例                    |
| -------- | -------------------------- | --------------------- |
| Tech/    | 技術メモ、チュートリアル   | Git、セットアップ手順 |
| Notes/   | 一般的な学習メモ、読書メモ | 読書記録、学習ノート  |

## ✍️ 文章スタイル

### 見出しレベル

- H1 (`#`) は使わない（Frontmatterの`title`が自動的にH1になる）
- H2 (`##`) から始める
- 見出しは最大H4までにする

### リンク

**内部リンク** (Obsidian形式):

```markdown
[[Tech/git-memo|Gitメモ]]
```

**外部リンク**:

```markdown
[Quartz公式ドキュメント](https://quartz.jzhao.xyz/)
```

### コードブロック

````markdown
```javascript
console.log("Hello, World!")
```
````

言語を明示することでシンタックスハイライトが適用されます。

## 🎨 Frontmatterの特殊機能

### 下書き機能

```yaml
draft: true
```

`draft: true` を設定すると、サイトには表示されません。

### 日付管理

```yaml
date: 2026-02-16
```

記事の作成日または最終更新日を記録します。フォルダページで日付順にソートされます。

## 🚫 避けるべきこと

1. **H1見出しの使用** - タイトルと重複します
2. **絵文字の過度な使用** - 見出しや重要な箇所に限定
3. **大きなバイナリファイルのコミット** - 画像は最適化してから追加
4. **プライベート情報の記載** - 公開されることを前提に

## ✅ チェックリスト

新しいコンテンツを作成する前に：

- [ ] Frontmatterに`title`が設定されている
- [ ] H1見出し（`#`）を使っていない
- [ ] AI支援の場合、`authorship`フィールドを追加した
- [ ] タグを適切に設定した
- [ ] 下書きの場合、`draft: true`を設定した
- [ ] プライベート情報が含まれていないか確認した

## 🔄 更新フロー

### 1. メモを書く

Obsidianの`publish`フォルダに書く

### 2. ローカルで確認

```bash
make serve
```

http://localhost:8080 で確認

### 3. 公開

```bash
make publish
```

約1-2分でサイトに反映されます。

## 🔒 禁止ワードチェック

コミット前に自動的に禁止ワードをチェックします。

### 設定方法

`forbidden-words.txt` ファイルで禁止ワードを管理：

```txt
# 個人情報保護
password
secret
api_key

# カスタムワード
your_forbidden_word
```

### 動作

- コミット時に自動チェック
- 禁止ワードが見つかるとコミット失敗
- 大文字小文字を区別しない
- 行の先頭に `#` でコメント化

### 手動チェック

```bash
./scripts/check-forbidden-words.sh
```

### 禁止ワードが検出された場合

1. 該当箇所を修正
2. 誤検知の場合は `forbidden-words.txt` から削除
3. 再度コミット

## 🐛 トラブルシューティング

### タイトルが二重表示される

→ Frontmatterの`title`とH1見出しが重複している可能性があります。H1見出しを削除してください。

### ページが表示されない

→ `draft: true` になっていないか確認してください。

### リンクが壊れている

→ 相対パスが正しいか確認してください。Obsidian形式の`[[]]`リンクを使用している場合、パスが正しいか確認してください。

## 📚 参考

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Obsidian Documentation](https://help.obsidian.md/)
- [Markdown Guide](https://www.markdownguide.org/)

---

_最終更新: 2026年2月16日_
