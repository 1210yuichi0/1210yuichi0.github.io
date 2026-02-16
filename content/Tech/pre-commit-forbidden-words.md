---
title: Git pre-commitで禁止ワードをチェックする
tags:
  - Git
  - pre-commit
  - セキュリティ
  - 自動化
date: 2026-02-16
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.5
  date: 2026-02-16
  reviewed: false
---

コミット前に自動的に禁止ワードをチェックして、機密情報の流出を防ぐ仕組みを実装しました。

## 概要

Git の pre-commit フックを使用して、ステージングされたファイルに禁止ワードが含まれていないかを自動チェックします。

**主な機能:**

- ✅ コミット前に自動チェック
- ✅ カスタマイズ可能な禁止ワードリスト
- ✅ 大文字小文字を区別しない検索
- ✅ ファイル名と行番号を表示
- ✅ カラー出力で視認性向上

## 実装

### ファイル構成

```
.
├── forbidden-words.txt.example   # 禁止ワードリストテンプレート（Git管理）
├── forbidden-words.txt           # 禁止ワードリスト（ローカル専用、Git管理外）
├── .gitignore                    # forbidden-words.txt を除外
├── scripts/
│   └── check-forbidden-words.sh  # チェックスクリプト
└── .husky/
    └── pre-commit                # Gitフック
```

### 重要: 禁止ワードリストの管理

**禁止ワードリストはGit管理から除外します。**

理由：

- 会社固有の機密ワードを含む可能性
- チームメンバーごとに異なる設定が必要な場合
- プライベートな検索パターンの保護

**セットアップ手順:**

```bash
# 1. テンプレートから禁止ワードリストを作成
cp forbidden-words.txt.example forbidden-words.txt

# 2. .gitignore に追加（既に設定済み）
echo "forbidden-words.txt" >> .gitignore

# 3. 必要に応じてカスタマイズ
nano forbidden-words.txt
```

**.gitignore:**

```
# 禁止ワードリスト（ローカル専用）
forbidden-words.txt
```

### 1. 禁止ワードリストテンプレート

**forbidden-words.txt.example:**

**forbidden-words.txt:**

```txt
# 禁止ワードリスト
# 行の先頭に # を付けるとコメントになります

# 個人情報保護
password
secret
api_key
private_key

# デバッグ用コメント（任意）
# TODO
# FIXME
```

### 2. チェックスクリプト

**scripts/check-forbidden-words.sh:**

```bash
#!/bin/bash
set -e

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 禁止ワードリストを読み込み
FORBIDDEN_WORDS_FILE="forbidden-words.txt"

if [ ! -f "$FORBIDDEN_WORDS_FILE" ]; then
    echo -e "${YELLOW}⚠️  警告: ${FORBIDDEN_WORDS_FILE} が見つかりません${NC}"
    if [ -f "forbidden-words.txt.example" ]; then
        echo -e "${YELLOW}💡 ヒント: 以下のコマンドでテンプレートからコピーできます${NC}"
        echo -e "   cp forbidden-words.txt.example forbidden-words.txt"
    fi
    exit 0
fi

# コメント行と空行を除外
FORBIDDEN_WORDS=$(grep -v '^#' "$FORBIDDEN_WORDS_FILE" | grep -v '^$' | tr '\n' '|' | sed 's/|$//')

if [ -z "$FORBIDDEN_WORDS" ]; then
    echo -e "${GREEN}✓ 禁止ワードチェック: スキップ${NC}"
    exit 0
fi

echo "🔍 禁止ワードをチェック中..."

# ステージングされたファイルを取得
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

FOUND_FORBIDDEN=false
ERROR_DETAILS=""

# 各ファイルをチェック
for FILE in $STAGED_FILES; do
    # バイナリファイルや特定のファイルをスキップ
    if [[ "$FILE" == *.png ]] || [[ "$FILE" == *.jpg ]] || \
       [[ "$FILE" == *node_modules/* ]] || [[ "$FILE" == *.lock ]]; then
        continue
    fi

    if [ ! -f "$FILE" ]; then
        continue
    fi

    # 禁止ワードを検索（大文字小文字を区別しない）
    MATCHES=$(grep -niE "$FORBIDDEN_WORDS" "$FILE" || true)

    if [ -n "$MATCHES" ]; then
        FOUND_FORBIDDEN=true
        ERROR_DETAILS="${ERROR_DETAILS}\n${RED}❌ $FILE:${NC}\n$MATCHES\n"
    fi
done

# 結果を表示
if [ "$FOUND_FORBIDDEN" = true ]; then
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⛔ 禁止ワードが検出されました！${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "$ERROR_DETAILS"
    echo -e "${YELLOW}💡 ヒント:${NC}"
    echo -e "  - forbidden-words.txt で禁止ワードを確認してください"
    echo -e "  - 必要に応じて該当箇所を修正してください"
    echo -e "  - 誤検知の場合は forbidden-words.txt からワードを削除してください"
    exit 1
else
    echo -e "${GREEN}✓ 禁止ワードチェック: OK${NC}"
    exit 0
fi
```

### 3. Git フック設定

**.husky/pre-commit:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 禁止ワードチェック
./scripts/check-forbidden-words.sh

# コード整形
npx lint-staged
```

## 動作確認

### テスト1: 禁止ワード検出

**テストファイル作成:**

```bash
echo "This file contains a password: test123" > test-forbidden.txt
git add test-forbidden.txt
./scripts/check-forbidden-words.sh
```

**結果:**

```
🔍 禁止ワードをチェック中...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ 禁止ワードが検出されました！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ test-forbidden.txt:
1:This file contains a password: test123

💡 ヒント:
  - forbidden-words.txt で禁止ワードを確認してください
  - 必要に応じて該当箇所を修正してください
  - 誤検知の場合は forbidden-words.txt からワードを削除してください
```

✅ **期待通り、禁止ワード "password" が検出されコミットがブロックされました。**

### テスト2: 安全なファイル

**テストファイル作成:**

```bash
echo "This is a safe file" > test-safe.txt
git add test-safe.txt
./scripts/check-forbidden-words.sh
```

**結果:**

```
🔍 禁止ワードをチェック中...
✓ 禁止ワードチェック: OK
```

✅ **期待通り、安全なファイルは正常に通過しました。**

## 使い方

### 基本的な使い方

通常通り `git commit` するだけで、自動的にチェックが実行されます：

```bash
git add .
git commit -m "Add new feature"
# → 自動的に禁止ワードチェックが実行される
```

### 禁止ワードを追加

`forbidden-words.txt` に追記：

```bash
echo "your_forbidden_word" >> forbidden-words.txt
```

### 手動チェック

コミット前に手動でチェックすることも可能：

```bash
./scripts/check-forbidden-words.sh
```

### 特定のワードを一時的に許可

コメントアウトして無効化：

```txt
# password  ← コメント化すると無効
secret
```

### 大文字小文字について

**チェックは大文字小文字を区別しません。**

`forbidden-words.txt` に小文字で記述するだけで、あらゆる大文字小文字の組み合わせを検出します。

**例:**

`forbidden-words.txt` に以下のように記述：

```txt
password
secret
api_key
```

**検出される例:**

- ✅ `password` / `PASSWORD` / `Password` / `pAsSwOrD`
- ✅ `secret` / `SECRET` / `Secret` / `SeCrEt`
- ✅ `api_key` / `API_KEY` / `Api_Key` / `API_key`

**実装:**

[check-forbidden-words.sh](scripts/check-forbidden-words.sh) で `grep -i` オプションを使用しているため、大文字小文字を無視して検索します：

```bash
MATCHES=$(grep -niE "$FORBIDDEN_WORDS" "$FILE" || true)
```

**推奨:**

- 禁止ワードは**小文字で統一**して記述
- シンプルで管理しやすい
- 検出時は自動的にすべてのケースをカバー

## カスタマイズ

### バイナリファイルの除外

スクリプト内で除外するファイルタイプを追加：

```bash
if [[ "$FILE" == *.pdf ]] || [[ "$FILE" == *.zip ]]; then
    continue
fi
```

### 正規表現を使った高度な検索

メールアドレスパターンを検出：

```txt
# forbidden-words.txt
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

### チェックをスキップする方法

緊急時など、一時的にチェックをスキップ：

```bash
git commit --no-verify -m "Emergency fix"
```

**⚠️ 注意:** `--no-verify` は慎重に使用してください。

## トラブルシューティング

### チェックが実行されない

**原因:** スクリプトに実行権限がない

**解決策:**

```bash
chmod +x scripts/check-forbidden-words.sh
```

### 誤検知が多い

**原因:** 禁止ワードが一般的すぎる

**解決策:**

- より具体的なワードに変更
- 正規表現で文脈を考慮した検索

### パフォーマンスが遅い

**原因:** 大量のファイルまたは大きなファイル

**解決策:**

- 特定のディレクトリを除外
- バイナリファイルを確実にスキップ

## ベストプラクティス

### 推奨する禁止ワード

**セキュリティ関連:**

- `password`, `passwd`, `pwd`
- `secret`, `api_key`, `access_token`
- `private_key`, `ssh_key`

**個人情報:**

- 実際のメールアドレスパターン
- 電話番号パターン
- クレジットカード番号パターン

### チーム運用

1. **テンプレートファイルで基本設定を共有**
   - `forbidden-words.txt.example` をGitで管理
   - 実際の `forbidden-words.txt` はローカル専用（`.gitignore`で除外）
   - 各メンバーがテンプレートからコピーしてカスタマイズ

2. **ローカル専用にする理由**
   - 会社固有の機密ワードを含む可能性
   - チームメンバーごとに異なる設定が可能
   - 誤って機密パターンをコミットするリスクを回避

3. **定期的な見直し**
   - テンプレートファイルを定期的に更新
   - 誤検知の多いワードはコメントアウト
   - 新しい脅威に対応したパターンを追加

4. **ドキュメント化**
   - テンプレートにコメントでなぜ禁止されているか記録
   - 例外ケースの対応方法をREADMEに明記
   - セットアップ手順を明確にする

## まとめ

pre-commit フックを使った禁止ワードチェックは、シンプルながら効果的なセキュリティ対策です。

**メリット:**

- ✅ 機密情報の流出防止
- ✅ コミット前の自動チェック
- ✅ カスタマイズ可能
- ✅ チーム全体で共有可能

**導入のポイント:**

- 禁止ワードは適度に設定（多すぎると邪魔）
- 誤検知を減らす工夫
- チームで運用ルールを決める

## 参考リンク

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Husky Documentation](https://typicode.github.io/husky/)
- [grep Manual](https://www.gnu.org/software/grep/manual/)

---

**関連記事:**

- [[CONTRIBUTING|コンテンツ作成ガイドライン]]
- [[Tech/setup-guide|Scrap Notes 構築手順]]
