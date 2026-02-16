#!/bin/bash

# 禁止ワードチェックスクリプト
# コミット前にステージングされたファイルをチェックし、禁止ワードが含まれていないか確認します

set -e

# カラー定義
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 禁止ワードリストファイル
FORBIDDEN_WORDS_FILE="forbidden-words.txt"

# 禁止ワードリストが存在しない場合は警告を出して終了
if [ ! -f "$FORBIDDEN_WORDS_FILE" ]; then
    echo -e "${YELLOW}⚠️  警告: ${FORBIDDEN_WORDS_FILE} が見つかりません${NC}"
    if [ -f "forbidden-words.txt.example" ]; then
        echo -e "${YELLOW}💡 ヒント: 以下のコマンドでテンプレートからコピーできます${NC}"
        echo -e "   cp forbidden-words.txt.example forbidden-words.txt"
    fi
    exit 0
fi

# コメント行と空行を除外して禁止ワードを読み込み
FORBIDDEN_WORDS=$(grep -v '^#' "$FORBIDDEN_WORDS_FILE" | grep -v '^$' | tr '\n' '|' | sed 's/|$//')

# 禁止ワードが設定されていない場合はスキップ
if [ -z "$FORBIDDEN_WORDS" ]; then
    echo -e "${GREEN}✓ 禁止ワードチェック: スキップ（禁止ワードが未設定）${NC}"
    exit 0
fi

echo "🔍 禁止ワードをチェック中..."

# ステージングされたファイルを取得
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# チェック結果を格納する変数
FOUND_FORBIDDEN=false
ERROR_DETAILS=""

# 各ファイルをチェック
for FILE in $STAGED_FILES; do
    # バイナリファイルや特定のファイルをスキップ
    if [[ "$FILE" == *.png ]] || [[ "$FILE" == *.jpg ]] || [[ "$FILE" == *.jpeg ]] || \
       [[ "$FILE" == *.gif ]] || [[ "$FILE" == *.ico ]] || [[ "$FILE" == *.pdf ]] || \
       [[ "$FILE" == *node_modules/* ]] || [[ "$FILE" == *.lock ]] || \
       [[ "$FILE" == *package-lock.json ]] || [[ "$FILE" == *yarn.lock ]] || \
       [[ "$FILE" == *forbidden-words.txt.example ]] || \
       [[ "$FILE" == *pre-commit-forbidden-words.md ]] || \
       [[ "$FILE" == "content/CONTRIBUTING.md" ]]; then
        continue
    fi

    # ファイルが存在しない場合はスキップ（削除されたファイル）
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
    echo ""
    exit 1
else
    echo -e "${GREEN}✓ 禁止ワードチェック: OK${NC}"
    exit 0
fi
