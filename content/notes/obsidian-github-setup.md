# Obsidian + GitHub セットアップガイド

このドキュメントでは、ObsidianとGitHubを連携させて、複数デバイス間でノートを同期する方法を説明します。

## 概要

- **Obsidian**: マークダウン形式のノート取りアプリ
- **GitHub**: バージョン管理とバックアップ
- **メリット**:
  - ✅ ノートのバージョン管理
  - ✅ 自動バックアップ
  - ✅ Mac/iOS間での同期
  - ✅ 変更履歴の追跡

---

## デスクトップ（Mac）でのセットアップ

### 1. Obsidianのインストール

```bash
# Homebrewでインストール
brew install --cask obsidian
```

または[公式サイト](https://obsidian.md/download)からダウンロード

### 2. contentディレクトリをボールトとして開く

```bash
# コマンドから開く
open -a Obsidian /Users/yada/Documents/github_private/1210yuichi0.github.io/content
```

または、Obsidianアプリから「Open folder as vault」を選択

### 3. .gitignoreの確認

`.obsidian` フォルダは既に `.gitignore` に含まれているため、個人設定はGitで管理されません。

### 4. ワークフロー

#### Obsidianで編集

1. Obsidianでノートを作成・編集
2. `[[リンク]]` で内部リンクを作成可能

#### Gitでコミット

```bash
# 変更を確認
git status

# コミット
git add content/
git commit -m "docs: update notes"

# プッシュ
git push
```

---

## モバイル（iOS）でのセットアップ

### 必要なアプリ

1. **Obsidian**（無料）- App Store
2. **Working Copy**（基本無料）- Gitクライアント

### セットアップ手順

#### ステップ1: Working Copyの設定

1. Working Copyを起動
2. Settings（⚙️）→ Hosting Providers → GitHub
3. GitHubアカウントにログイン

#### ステップ2: リポジトリをクローン

1. Working Copyで「+」ボタン
2. Clone repository
3. `1210yuichi0.github.io` を検索してクローン

**プライベートリポジトリの場合:**

- GitHubでPersonal Access Tokenを作成
- Settings → Developer settings → Personal access tokens
- `repo` 権限を付与してトークンを生成
- Working Copyでトークンを使用

#### ステップ3: Obsidianと連携

1. Obsidianアプリを起動
2. Open folder as vault
3. 「Working Copy」を選択
4. `1210yuichi0.github.io/content` を選択

### モバイルでの同期ワークフロー

#### 📝 編集後の同期

1. Obsidianで編集
2. Working Copyを開く
3. 変更をコミット（Commit）
4. プッシュ（Push）

#### 📥 他のデバイスの変更を取得

1. Working Copyを開く
2. Pull（引っ張る）を実行

---

## オプション: 自動化

### Mac: Obsidian Gitプラグイン

自動コミット・プッシュを設定したい場合：

1. Obsidianの設定 → Community plugins → Browse
2. "Obsidian Git" を検索してインストール
3. 自動バックアップの間隔を設定（例: 30分ごと）

### iOS: ショートカットアプリ

iOSの「ショートカット」アプリで自動プル/プッシュを設定可能

---

## トラブルシューティング

### コンフリクト（競合）が発生した場合

```bash
# 現在の状態を確認
git status

# リモートの変更を取得
git pull

# コンフリクトを解決後
git add .
git commit -m "docs: resolve merge conflict"
git push
```

### Working Copyで認証エラーが出る場合

- Personal Access Tokenの権限を確認
- トークンの有効期限を確認
- 必要に応じて新しいトークンを生成

---

## 参考リンク

- [Obsidian公式サイト](https://obsidian.md/)
- [Working Copy](https://workingcopyapp.com/)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)

---

最終更新: 2026-02-16
