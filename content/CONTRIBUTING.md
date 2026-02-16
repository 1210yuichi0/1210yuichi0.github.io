---
title: コンテンツ作成ガイドライン
draft: true
tags:
  - ガイド
  - ドキュメント作成
date: 2026-02-16
---

# コンテンツ作成ガイドライン

このサイト（Scrap Notes）のコンテンツを作成・管理するための包括的なガイドラインです。

## フォルダ構成

```
content/
├── index.md              # トップページ
├── about.md              # Aboutページ
├── tech/                 # 技術関連の記事
├── notes/                # 一般的なノート・メモ
├── ideas/                # アイデアノート
├── 個人情報保護法/        # 個人情報保護法の解説
└── CONTRIBUTING.md       # このファイル
```

### 各フォルダの用途

| フォルダ          | 用途                                             | 推奨タグ                 | 例                       |
| ----------------- | ------------------------------------------------ | ------------------------ | ------------------------ |
| `tech/`           | 技術的な記事、チュートリアル、セットアップガイド | `tech`, `setup`, `guide` | Quartz設定、Markdown記法 |
| `notes/`          | 一般的なメモ、学習ノート、まとめ                 | `notes`, `学習`          | 読書メモ、調査結果       |
| `ideas/`          | アイデア、構想、実験的なメモ                     | `アイデア`, `実験`       | 新規プロジェクト案       |
| `個人情報保護法/` | 個人情報保護法の条文解説                         | `個人情報保護法`, `法律` | 各条文の解説             |

## 新規ドキュメント作成の基本

### 1. ファイル名の規則

**推奨:**

```
小文字-ハイフン-区切り.md
example-document-name.md
setup-guide.md
```

**避けるべき:**

```
❌ CamelCase.md
❌ snake_case.md
❌ 日本語ファイル名.md（特殊な場合を除く）
❌ スペース入り file name.md
```

**例外:**

- `個人情報保護法/` 配下は日本語OK
- `index.md` は各フォルダのインデックス
- `README.md` はガイド用

### 2. フロントマターの必須項目

すべてのMarkdownファイルには、先頭にフロントマター（YAML形式のメタデータ）が必要です。

**最小構成:**

```yaml
---
title: ドキュメントのタイトル
tags:
  - タグ1
  - タグ2
date: 2026-02-16
---
```

**完全版:**

```yaml
---
title: ドキュメントのタイトル
draft: false
tags:
  - タグ1
  - タグ2
date: 2026-02-16
authorship:
  type: human
  # または ai-assisted の場合:
  # type: ai-assisted
  # model: Claude Sonnet 4.5
  # date: 2026-02-16
  # reviewed: false
---
```

### 3. フロントマター項目の詳細

#### `title` (必須)

- ドキュメントのタイトル
- 日本語・英語どちらもOK
- 一覧ページやブラウザタブに表示される

```yaml
title: Quartzのセットアップガイド
```

#### `tags` (必須)

- 最低1つのタグを設定
- リスト形式で記述
- 日本語・英語どちらもOK
- 既存のタグを確認: https://1210yuichi0.github.io/tags/

```yaml
tags:
  - tech
  - setup
  - Quartz
```

#### `date` (必須)

- 作成日または最終更新日
- YYYY-MM-DD 形式
- リスト表示でソートに使用される

```yaml
date: 2026-02-16
```

#### `draft` (オプション)

- 下書き状態を示す
- `true`: サイトに表示されない
- `false` または省略: 公開される

```yaml
draft: true  # 下書き
draft: false # 公開（省略可）
```

#### `authorship` (オプション)

- ドキュメントの作成方法を明示
- AI支援の有無を記録

**人間が作成:**

```yaml
authorship:
  type: human
```

**AI支援:**

```yaml
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-16
  reviewed: false # レビュー済みならtrue
```

## タグ設定のベストプラクティス

### 推奨タグ一覧

**カテゴリ別タグ:**

- **技術**: `tech`, `programming`, `setup`, `guide`, `tutorial`
- **学習**: `learning`, `notes`, `study`, `読書`
- **アイデア**: `アイデア`, `実験`, `構想`, `改善`
- **法律**: `個人情報保護法`, `法律`, `解説`
- **メタ**: `test`, `markdown`, `ガイド`, `ドキュメント作成`

### タグの命名規則

1. **明確で検索しやすい名前**
   - ✅ `Quartz`, `setup-guide`
   - ❌ `その他`, `メモ1`

2. **既存タグの再利用**
   - 新規タグを作る前に https://1210yuichi0.github.io/tags/ を確認
   - 似たタグがあれば統一する

3. **適切な粒度**
   - ✅ `個人情報保護法` （具体的）
   - ❌ `法律` だけ（広すぎる）

4. **1つのドキュメントに2-5個程度**
   - 多すぎると管理が大変
   - 少なすぎると検索しにくい

## Markdown記法

基本的なMarkdown記法はすべて利用可能です。詳細は [Markdown記法テスト](/tech/markdown-syntax-test) を参照。

### サポート機能

- ✅ コードブロック（シンタックスハイライト）
- ✅ 表（テーブル）
- ✅ リスト（箇条書き・番号付き）
- ✅ 引用
- ✅ リンク（内部・外部）
- ✅ 画像
- ✅ Mermaid図（フローチャート、シーケンス図など）
- ✅ YouTube埋め込み（URLを貼るだけ）
- ✅ 数式（LaTeX）

### 内部リンク

サイト内の別ページへのリンク：

```markdown
[別のページへ](/tech/setup-guide)
[トップページ](/)
[相対パス](../notes/example)
```

### 画像の配置

画像は `/public/images/` に配置：

```markdown
![画像の説明](/images/screenshot.png)
```

## ワークフロー

### 新規ドキュメントの作成

1. **適切なフォルダを選択**

   ```bash
   cd content/tech/  # または notes/, ideas/ など
   ```

2. **テンプレートをコピー（推奨）**

   ```bash
   # アイデアの場合
   cp content/ideas/TEMPLATE.md content/ideas/new-idea.md

   # 技術記事の場合は新規作成
   touch content/tech/new-article.md
   ```

3. **フロントマターを設定**
   - title, tags, date を記述
   - 必要に応じて draft, authorship を追加

4. **本文を執筆**
   - Markdown形式で記述
   - 見出し、リスト、コードブロックを活用

5. **ローカルで確認**

   ```bash
   npx quartz build --serve
   # http://localhost:8080 で確認
   ```

6. **コミット & デプロイ**
   ```bash
   git add content/tech/new-article.md
   git commit -m "docs: add new article about [テーマ]"
   git push origin main
   ```

### 下書きから公開へ

1. **下書きとして作成**

   ```yaml
   draft: true
   ```

2. **内容を充実させる**
   - 必要な情報を追加
   - 誤字脱字をチェック
   - タグを見直す

3. **公開する**

   ```yaml
   draft: false # または削除
   ```

4. **デプロイ**
   ```bash
   git add content/path/to/file.md
   git commit -m "docs: publish [タイトル]"
   git push origin main
   ```

## フォルダ別ガイド

### Tech/ - 技術記事

**用途:**

- セットアップガイド
- チュートリアル
- 技術解説
- トラブルシューティング

**推奨構成:**

```markdown
---
title: 技術記事のタイトル
tags:
  - tech
  - 具体的な技術名
date: YYYY-MM-DD
---

# タイトル

## 概要

何について書かれているか

## 前提条件

必要な知識や環境

## 手順

1. ステップ1
2. ステップ2

## トラブルシューティング

よくある問題と解決方法

## まとめ
```

### Notes/ - 一般ノート

**用途:**

- 学習メモ
- 調査結果
- まとめ記事
- 読書ノート

**推奨構成:**

```markdown
---
title: ノートのタイトル
tags:
  - notes
  - カテゴリ
date: YYYY-MM-DD
---

# タイトル

## 学んだこと

要点をまとめる

## 詳細

具体的な内容

## 参考資料
```

### Ideas/ - アイデアノート

**詳細ガイド:** [ideas/README.md](./ideas/README.md)

**用途:**

- 新しいアイデア
- 実験的なメモ
- 構想

**テンプレート:** [ideas/TEMPLATE.md](./ideas/TEMPLATE.md)

### 個人情報保護法/ - 法律解説

**用途:**

- 個人情報保護法の条文解説
- 法律関連のまとめ

**命名規則:**

```
第XX条 (条文タイトル).md
第1章 総則/第1条 (目的).md
```

**フロントマター:**

```yaml
---
title: 第XX条 (条文タイトル)
tags:
  - 個人情報保護法
  - 第X章
date: YYYY-MM-DD
---
```

## チェックリスト

### 公開前チェックリスト

- [ ] ファイル名が規則に従っている
- [ ] フロントマターに必須項目が揃っている
  - [ ] title
  - [ ] tags（最低1つ）
  - [ ] date（YYYY-MM-DD形式）
- [ ] AI支援の場合は authorship を設定
- [ ] draft状態を確認（公開する場合は false または削除）
- [ ] 本文に最低限の内容がある
- [ ] リンクが正しく動作する
- [ ] ローカルでビルド確認
- [ ] コミットメッセージが分かりやすい

### 品質チェックリスト

- [ ] タイトルが内容を適切に表現している
- [ ] タグが適切に設定されている
- [ ] 誤字脱字がない
- [ ] コードブロックのシンタックスハイライトが正しい
- [ ] 画像のパスが正しい
- [ ] 内部リンクが切れていない
- [ ] 見出し構造が適切（h1 → h2 → h3）
- [ ] 必要に応じて目次がある

## トラブルシューティング

### ビルドエラー

**問題:** ビルドが失敗する

**確認事項:**

1. フロントマターのYAML形式が正しいか
   - インデントは2スペース
   - コロン（:）の後にスペース
2. 日付が YYYY-MM-DD 形式か
3. タグがリスト形式か
4. Markdown構文に問題がないか

**解決方法:**

```bash
# ローカルでビルドしてエラーを確認
npx quartz build

# エラーメッセージを読んで該当ファイルを修正
```

### ページが表示されない

**確認事項:**

1. `draft: true` になっていないか
2. ファイルが正しい場所にあるか
3. フロントマターが正しいか
4. ビルドが成功しているか

### タグが表示されない

**確認事項:**

```yaml
# ✅ 正しい
tags:
  - タグ1
  - タグ2

# ❌ 間違い
tags: タグ1, タグ2
```

### 画像が表示されない

**確認事項:**

1. 画像が `/public/images/` にあるか
2. パスが `/images/filename.png` か（先頭のスラッシュ必須）
3. ファイル名が正しいか（大文字小文字の区別）

## コミットメッセージの規則

Git コミットメッセージは以下の形式を推奨：

```
種類: 簡潔な説明

詳細な説明（オプション）
```

**種類の例:**

- `docs:` ドキュメントの追加・更新
- `feat:` 新機能
- `fix:` バグ修正
- `style:` スタイルの変更
- `refactor:` リファクタリング

**例:**

```bash
git commit -m "docs: add setup guide for Quartz"
git commit -m "docs: update markdown syntax test with YouTube embed"
git commit -m "feat: add ideas folder with templates"
```

## ベストプラクティス

### ファイル管理

1. **フォルダを適切に使い分ける**
   - 技術的な内容 → `tech/`
   - 一般的なメモ → `notes/`
   - アイデア → `ideas/`

2. **関連するドキュメントを相互リンク**

   ```markdown
   詳細は [別の記事](./related-article.md) を参照
   ```

3. **古いコンテンツは削除せず下書きに**
   ```yaml
   draft: true # 非表示だが履歴は残る
   ```

### コンテンツ品質

1. **明確な見出し構造**
   - h1 は1つだけ（通常はタイトル）
   - h2, h3 を使って階層化

2. **読みやすさを重視**
   - 適度に改行
   - 箇条書きを活用
   - 長い文章は段落分け

3. **コードブロックは言語を指定**

   ````markdown
   ```javascript
   console.log("Hello")
   ```
   ````

4. **例やスクリーンショットを追加**
   - 理解を助ける視覚的要素

### メンテナンス

1. **定期的にタグを整理**
   - 似たタグを統合
   - 未使用のタグを確認

2. **リンク切れをチェック**
   - 内部リンクの確認
   - 外部リンクの生存確認

3. **古い情報を更新**
   - date を更新
   - 内容の見直し

## 参考リンク

- [Markdown記法テスト](/tech/markdown-syntax-test)
- [アイデアノート作成ガイド](./ideas/README.md)
- [Quartzドキュメント](https://quartz.jzhao.xyz)

---

_更新日: 2026-02-16_
