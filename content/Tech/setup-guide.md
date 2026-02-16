---
title: Scrap Notes 構築手順
tags:
  - quartz
  - obsidian
  - github-pages
  - セットアップ
date: 2026-02-14
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-14
  reviewed: false
---

Quartz v4 + Obsidian + GitHub Pagesでスクラップメモサイトを構築した手順です。

## 🎯 完成形

- **サイトURL**: https://1210yuichi0.github.io/
- **構成**: Obsidian でメモ → GitHub Pages で公開
- **特徴**: `make publish` で自動デプロイ

## 📋 前提条件

- Node.js v22以上
- npm v10.9.2以上
- Git
- GitHub CLI (`gh`)
- SSH設定済み（複数GitHubアカウント対応）

## 🚀 構築手順

### 1. GitHubリポジトリの作成

```bash
# GitHubでリポジトリ作成: 1210yuichi0.github.io
# SSH設定（個人アカウント用）
cd ~/.ssh
ssh-keygen -t rsa -C "my_personal_github_key" -f github_private
```

**SSH config** (`~/.ssh/config`):

```
Host private.github.com
  HostName github.com
  User git
  TCPKeepAlive yes
  IdentitiesOnly yes
  IdentityFile /Users/{name}/.ssh/github_private
```

**接続テスト**:

```bash
ssh -T git@private.github.com
```

### 2. Quartzのクローンとセットアップ

```bash
cd /Users/yada/Documents/github_private
git clone https://github.com/jackyzha0/quartz.git 1210yuichi0.github.io
cd 1210yuichi0.github.io

# Git remoteを個人リポジトリに変更
git remote set-url origin git@private.github.com:1210yuichi0/1210yuichi0.github.io.git

# 依存関係のインストール
npm install
```

### 3. Quartz設定のカスタマイズ

**`quartz.config.ts`** を編集：

```typescript
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Scrap Notes",
    locale: "ja-JP",
    baseUrl: "1210yuichi0.github.io",
    // ...
  },
  // ...
}
```

### 4. GitHub Actionsワークフローの作成

**`.github/workflows/deploy.yml`** を作成：

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx quartz build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 5. Obsidian Vaultの作成

```bash
mkdir -p /Users/yada/Documents/ObsidianVault/publish
```

### 6. Makefileの作成

**`Makefile`** を作成：

```makefile
OBSIDIAN_PATH := /Users/yada/Documents/ObsidianVault/publish
CONTENT_PATH := ./content

.PHONY: help sync build serve dev publish clean

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

sync: ## Obsidian vaultからcontentへコピー
	@echo "📝 Syncing content from Obsidian vault..."
	@rm -rf $(CONTENT_PATH)/*
	@cp -r $(OBSIDIAN_PATH)/* $(CONTENT_PATH)/
	@echo "✅ Sync complete!"

build: sync ## サイトをビルド
	@echo "🔨 Building site..."
	@npx quartz build
	@echo "✅ Build complete!"

serve: sync ## ローカルサーバーで実行
	@echo "🚀 Starting local server..."
	@npx quartz build --serve

dev: serve

publish: sync ## GitHub にプッシュしてデプロイ
	@echo "📤 Publishing to GitHub..."
	@git add .
	@git commit -m "Update content from Obsidian vault" || echo "No changes"
	@git push
	@echo "✅ Published!"

clean: ## 生成ファイルを削除
	@rm -rf public $(CONTENT_PATH)/*
```

### 7. 初期コンテンツの作成

**Obsidian Vaultにindex.mdを作成**:

```bash
/Users/yada/Documents/ObsidianVault/publish/index.md
```

```markdown
---
title: Scrap Notes
---

# Scrap Notes 📝

Obsidianで書いたメモを公開しています。
```

### 8. デプロイ

```bash
# ブランチ名をv4からmainに変更
git branch -m v4 main
git push -u origin main

# GitHub Pagesの設定
# Settings → Pages → Source → GitHub Actions

# コンテンツをプッシュ
make publish
```

## 📝 日常の使い方

### メモを書く

Obsidianで `/Users/yada/Documents/ObsidianVault/publish/` にメモを書く

### ローカルでプレビュー

```bash
cd /Users/yada/Documents/github_private/1210yuichi0.github.io
make serve
```

ブラウザで http://localhost:8080 を開く

### 公開

```bash
make publish
```

自動的に以下が実行されます：

1. Obsidian Vault → content へ同期
2. Git commit & push
3. GitHub Actions でビルド
4. GitHub Pages にデプロイ

## 🔧 コマンド一覧

| コマンド       | 説明                 |
| -------------- | -------------------- |
| `make help`    | コマンド一覧を表示   |
| `make sync`    | Obsidianから同期のみ |
| `make serve`   | ローカルサーバー起動 |
| `make build`   | ビルドのみ           |
| `make publish` | GitHubに公開         |
| `make clean`   | 生成ファイル削除     |

## 📂 ディレクトリ構造

```
1210yuichi0.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions
├── content/                    # 公開コンテンツ（Obsidianから同期）
├── quartz/                     # Quartzコア
│   ├── components/            # UIコンポーネント
│   ├── plugins/               # プラグイン
│   └── static/                # 静的ファイル
├── public/                     # ビルド出力（git管理外）
├── quartz.config.ts           # Quartz設定
├── Makefile                   # タスク自動化
└── README.md                  # プロジェクトREADME
```

```
ObsidianVault/
└── publish/                    # 公開用メモ
    ├── index.md
    ├── git-memo.md
    └── setup-guide.md
```

## 🎨 カスタマイズ

### サイトタイトル変更

`quartz.config.ts` の `pageTitle` を編集

### テーマ変更

`quartz.config.ts` の `theme.colors` を編集

### プラグイン追加

`quartz.config.ts` の `plugins` セクションに追加

## 🐛 トラブルシューティング

### デプロイが失敗する

```bash
# ワークフロー実行状況を確認
gh run list --workflow=deploy.yml --limit 5

# 詳細を確認
gh run view <run-id>
```

### OGP画像が表示されない

`quartz.config.ts` で `Plugin.CustomOgImages()` をコメントアウト

### SSH接続エラー

```bash
# SSH Agentに鍵を追加
ssh-add ~/.ssh/github_private

# 接続テスト
ssh -T git@private.github.com
```

## 📚 参考リンク

- [Quartz公式ドキュメント](https://quartz.jzhao.xyz/)
- [Obsidian](https://obsidian.md/)
- [GitHub Pages](https://pages.github.com/)
- [参考記事: ObsidianとQuartz 4でメモサイト構築](https://mizzy.org/blog/2025/08/30/1/)

## ✨ 完成！

これで、Obsidianで気軽にメモを書いて、`make publish` で即座に公開できる環境が完成しました。

**サイトURL**: https://1210yuichi0.github.io/

---

_作成日: 2026年2月14日_
