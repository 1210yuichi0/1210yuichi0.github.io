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

### フォルダ用ファイルに詳細ドキュメントを書かない

**⛔ index.md / README.md には技術ドキュメントを書かない**

フォルダの概要やナビゲーション用ファイル（`index.md`, `README.md`）には、詳細な技術ドキュメントは書きません。

**✅ 良い使い方** - ナビゲーションのみ:

```markdown
---
title: dbt検証レポート
---

dbt + BigQueryの設定項目検証結果の一覧です。

## カテゴリ別ガイド

- [プロジェクト設定](project-config.md)
- [BigQuery接続](bigquery-connection.md)
- [Models設定](models/)
```

**❌ 禁止** - 詳細ドキュメント記載:

```markdown
---
title: dbt検証レポート
---

## dbt_project.ymlの詳細設定

dbt_project.ymlは...（数百行の詳細説明）

### name設定の詳細

nameパラメータは...（詳細説明）
```

**理由**:
- index/READMEファイルは**目次・ナビゲーション**専用
- 詳細な内容は個別ファイルに分けることで管理・検索性が向上
- URLが明確に区別される（`folder/` vs `folder/specific-topic`）

**ルール**: 詳細な技術ドキュメントは必ず個別ファイルとして作成し、index/READMEからリンクする

---

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

### index.mdファイルの使用ルール

**⛔ \_index.mdは使用禁止**

`_index.md` ファイルは使用しないでください。代わりに通常のマークダウンファイルを使用します。

**❌ 禁止**:

```
content/Tech/dbt/_index.md  # 使用禁止
```

**✅ 推奨**:

```
content/Tech/dbt/index.md   # OK: フォルダトップページ
content/Tech/dbt/README.md  # OK: フォルダ概要
```

**理由**:

- `_index.md` は特殊なファイル名で管理が複雑
- 通常のファイル名の方が明確で管理しやすい
- Quartzでは通常のマークダウンファイルで十分機能する

---

**index.md/README.mdに詳細なドキュメントを書かない**

フォルダの概要やナビゲーション用ファイル（`index.md`, `README.md`）には、詳細なドキュメントは書かず、以下のように使用します：

**✅ 良い使い方**:

```markdown
---
title: dbt関連記事
---

dbtに関する検証レポートとガイドの一覧です。

## 記事一覧

- [[Tech/dbt/dbt-unit-tests-bigquery-verification|dbt unit tests検証]]
- [[Tech/dbt/bigquery-dbt-model-config-verification|dbtモデル設定ガイド]]
- [[Tech/dbt/dbt-project-config-verification|dbtプロジェクト設定]]

## 関連リンク

- [dbt公式ドキュメント](https://docs.getdbt.com/)
```

**❌ 悪い使い方**:

```markdown
---
title: dbt関連記事
---

# dbt unit testsの詳細な使い方

unit testsは、dbt 1.8+で導入された機能で...
（数百行の詳細なドキュメント）
```

**理由**:

- indexファイルは**目次・ナビゲーション**の役割
- 詳細な内容は別ファイルに分けることで、管理しやすくなる
- URLが `folder/` と `folder/article-name` で明確に区別される

**ルール**:

- `_index.md` は使用禁止（代わりに `index.md` または `README.md` を使用）
- **index/READMEファイルには詳細な技術ドキュメントを書かない**（ナビゲーション専用）
- 詳細な技術ドキュメントは必ず個別ファイルとして作成

---

### フォルダ構造のルール

**⛔ フォルダのネストは最小限に**

contentフォルダ内では、深いフォルダ階層を作りません。

**✅ 許容される構造**:

```
content/
├── Tech/
│   ├── dbt/
│   │   ├── index.md
│   │   ├── overview.md
│   │   ├── categories/
│   │   │   ├── project-config.md
│   │   │   └── bigquery-connection.md
│   │   └── guides/
│   │       └── quick-reference.md
```

**❌ 避けるべき構造** - 深すぎるネスト:

```
content/
├── Tech/
│   ├── dbt/
│   │   ├── categories/
│   │   │   ├── models/
│   │   │   │   ├── materialization/      # ⚠️ 深すぎる
│   │   │   │   │   └── details.md
```

**理由**:
- URL が長くなりすぎる
- ナビゲーションが複雑になる
- ファイル管理が困難になる

---

**⛔ 1フォルダあたり最大約15ファイル**

1つのフォルダに含まれるファイル数は**約15個以下**を目安にします。

**✅ 良い例**:

```
content/Tech/dbt/categories/
├── project-config.md        (1)
├── bigquery-connection.md   (2)
├── testing-config.md        (3)
...
├── other-config.md          (9)  # ✅ 15個以下
```

**❌ 悪い例**:

```
content/Tech/dbt/
├── article-01.md
├── article-02.md
...
├── article-25.md   # ❌ 多すぎる
```

**理由**:
- ファイル数が多すぎると管理が困難
- フォルダ内で目的のファイルを見つけにくい
- サブフォルダで分類すべきサイン

**対処法**: ファイルが15個を超えそうな場合は、サブフォルダで分類するか、既存の分類を見直す

---

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

## 📖 技術用語とスタイル

### dbt固有名詞は英語で記載

dbt-specificな技術用語は、公式ドキュメントに合わせて英語で記載します：

**✅ 推奨**:

- Seeds (not シード)
- Snapshots (not スナップショット)
- Hooks (not フック)
- Models (not モデル)
- Tests (not テスト)
- Contracts (not コントラクト)
- Exposures (not エクスポージャー)

**理由**:

- 公式ドキュメントとの一貫性
- 技術コミュニティでの検索性向上
- グローバルな互換性

参考: [dbt Developer Hub](https://docs.getdbt.com/)

### プロモーショナル表現を避ける

客観的で正確な表現を使用します：

**❌ 避けるべき表現**:

- "完全ガイド" → "ガイド" または機能名のみ
- "完全検証" → "検証"
- "完全網羅" → "網羅" または "詳細"
- "全〇〇項目の完全ガイド" → "〇〇項目のガイド" または "詳細ガイド"

**✅ 良い例**:

```markdown
title: "Partitioning & Clustering"

# BigQueryパーティショニング＆クラスタリング
```

**❌ 悪い例**:

```markdown
title: "パーティショニング＆クラスタリング完全ガイド"

# BigQueryパーティショニング＆クラスタリング完全ガイド - 全設定を完全網羅
```

### タグは小文字英語で統一

**✅ 推奨**:

```yaml
tags: ["dbt", "bigquery", "testing", "best-practices"]
```

**❌ 非推奨**:

```yaml
tags: ["DBT", "BigQuery", "テスト", "Best-Practices"]
```

### フォルダ名は Title Case

```
content/
├── Tech/        # ✅ 技術記事
├── Ideas/       # ✅ アイデア・提案
├── Notes/       # ✅ 一般ノート
└── Projects/    # ✅ プロジェクト
```

## 🚫 避けるべきこと

1. **\_index.mdファイルの使用** - index.md または README.md を使用してください
2. **index/READMEに詳細ドキュメント記載** - ナビゲーション専用、詳細は個別ファイルに
3. **深すぎるフォルダ階層** - ネストは最小限に、URLが長くなりすぎないように
4. **1フォルダに多数のファイル** - 目安は約15ファイルまで、超える場合はサブフォルダで分類
5. **絵文字の過度な使用** - 見出しや重要な箇所に限定
6. **大きなバイナリファイルのコミット** - 画像は最適化してから追加
7. **プライベート情報の記載** - 公開されることを前提に
8. **プロモーショナル表現** - "完全"、"最強"、"究極" などの誇張表現
9. **dbt用語の日本語訳** - Seeds/Snapshots/Hooks/Models/Testsは英語で

## 📁 ドキュメント構成の原則

### 機能別に分割する

大きな技術ドキュメントは、機能ごとに分割して管理します。

**✅ 良い構成**:

```
Tech/dbt/
├── index.md                           # ナビゲーションハブ (40行)
├── overview.md                        # プロジェクト概要
├── partitioning-clustering-guide.md   # 機能別: パーティショニング
├── authentication-guide.md            # 機能別: 認証
├── incremental-strategies-guide.md    # 機能別: 増分戦略
└── guides/
    ├── learning-guide.md              # 学習パス
    └── execution-guide.md             # 実行手順
```

**❌ 悪い構成**:

```
Tech/dbt/
├── _index.md          # ⛔ 使用禁止
├── index.md           # すべての詳細を1ファイルに (可読性低下)
└── all-features.md    # すべての機能を1ファイルに (管理困難)
```

**理由**:

- 各ファイルが特定の目的を持つ
- 検索性・メンテナンス性の向上
- 読者が必要な情報に素早くアクセスできる

### カテゴリ別 vs 機能別

**カテゴリ別ガイド** (包括的):

- `models.md` - Models全般の30項目
- `tests.md` - Tests全般の15項目

**機能別ガイド** (特化型):

- `partitioning-clustering-guide.md` - パーティション＆クラスタ特化
- `unit-tests-guide.md` - Unit Tests特化
- `contracts-guide.md` - Contracts特化

両方を提供することで、**概要を知りたい人**と**特定機能を深掘りしたい人**の両方をサポートします。

## ✅ チェックリスト

新しいコンテンツを作成する前に：

- [ ] Frontmatterに`title`が設定されている
- [ ] `_index.md` を使用していない（`index.md` または `README.md` を使用）
- [ ] **index.md/README.mdに詳細ドキュメントを書いていない**（ナビゲーション専用）
- [ ] **フォルダ階層が深すぎない**（最小限のネストに）
- [ ] **フォルダ内のファイル数が約15個以下**（目安、超える場合はサブフォルダで分類）
- [ ] dbt用語は英語で記載している（Seeds/Snapshots/Hooks/Models/Tests）
- [ ] プロモーショナル表現（"完全"等）を避けている
- [ ] タグは小文字英語で統一している
- [ ] AI支援の場合、`authorship`フィールドを追加した
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

_最終更新: 2026年2月17日_
