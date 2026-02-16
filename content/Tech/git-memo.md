---
title: Gitメモ
tags:
  - git
  - github
  - 開発環境
date: 2024-02-29
---

Gitの使い方、GitHub運用、複数アカウント管理などのメモ集

## Git Stash

Stash操作には2つのモード：

- **Apply Stash**: 保存内容を残したまま取り込む
- **Pop Stash**: 保存内容を削除して取り込む

## GitHub Issue管理

### Commit連携

チケット番号（`#1`等）をコミットメッセージに含めると、該当Issueへ自動リンク生成される

### Projects

Issuesの各チケットを横断的に管理可能

### デフォルトラベル

| ラベル           | 説明             |
| ---------------- | ---------------- |
| bug              | バグ             |
| enhancement      | 新機能・改善     |
| documentation    | ドキュメント関連 |
| good first issue | 初心者向け       |
| help wanted      | 改善方法未決定   |

### イシューラベルの優先度分類

| 優先度 | 絵文字 | カラー    |
| ------ | ------ | --------- |
| High   | 🔥     | `#B60205` |
| Medium | ✒️     | `#ee7800` |
| Low    | 🍵     | `#C2E0C6` |

### イシューテンプレート

```markdown
# 概要／Overview

# 詳細／Detail

# 再現手順／Reproduction Procedure

# 現状の状態／Status

# キャプチャまたは動画

# 考えられる原因／Possible causes

# 修正案／Proposed amendment
```

## 複数GitHubアカウント管理

### .gitconfigの設定

ディレクトリごとに異なるGit設定を使用：

```bash
[includeIf "gitdir:~/development/company/"]
    path = .gitconfig_company
[includeIf "gitdir:~/development/private/"]
    path = .gitconfig_private
```

### VSCode設定

複数アカウント使用時は **Visual Studio Code Insiders** を推奨

## SSH複数アカウント設定

### 1. SSH鍵生成

```bash
cd ~/.ssh
ssh-keygen -t rsa -C "my_personal_github_key" -f github_private
```

### 2. SSH config設定

⚠️ **重要**: `IdentityFile`は絶対パスで指定

```
Host private.github.com
  HostName github.com
  User git
  TCPKeepAlive yes
  IdentitiesOnly yes
  IdentityFile /Users/{name}/.ssh/github_private
```

### 3. SSH接続テスト

```bash
ssh -T private.github.com
```

成功時の出力：

```
Hi [ユーザー名]! You've successfully authenticated, but GitHub does not provide shell access.
```

### 4. リポジトリクローン

```bash
git clone git@private.github.com:ユーザー名/リポジトリ名.git
```

### トラブルシューティングチェックリスト

| 項目          | 確認内容                         | 解決策                |
| ------------- | -------------------------------- | --------------------- |
| config のパス | `IdentityFile`が絶対パスか？     | 絶対パスに修正        |
| 鍵の存在      | 秘密鍵ファイルが存在するか？     | 鍵を再生成            |
| GitHub登録    | 公開鍵が正しく登録されているか？ | 再登録                |
| SSH Agent     | `ssh-add -l`で鍵が表示されるか？ | `ssh-add`を実行       |
| クローンURL   | ホストの別名を使用しているか？   | 正しい形式のURLを使用 |

## VSCode設定

### Smart Commit

```json
{
  "git.enableSmartCommit": true
}
```

## 参考リンク

- [Gitのスタッシュ機能について](関連記事)
- [GitHubでのTodo管理](関連記事)
- [複数GitHubアカウントSSH接続ガイド](関連記事)

---

_最終更新: 2025年12月7日_
