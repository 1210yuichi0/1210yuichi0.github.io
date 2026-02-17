#!/usr/bin/env bash

# CONTRIBUTING.md ルールチェックスクリプト
# Pre-commit時に実行され、ルール違反があればコミットを中止する

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 CONTRIBUTING.md ルールをチェック中..."

# ステージされたマークダウンファイルを取得
STAGED_MD_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.md$' || true)

if [ -z "$STAGED_MD_FILES" ]; then
  echo -e "${GREEN}✓ チェック対象のマークダウンファイルなし${NC}"
  exit 0
fi

ERROR_COUNT=0

# ============================================
# 1. ファイル名チェック (kebab-case)
# ============================================
echo ""
echo "📝 [1/8] ファイル名チェック (kebab-case, 英語のみ)..."
for file in $STAGED_MD_FILES; do
  basename=$(basename "$file")

  # _index.md 禁止チェック
  if [ "$basename" = "_index.md" ]; then
    echo -e "${RED}✗ _index.md は使用禁止: $file${NC}"
    echo -e "  → index.md または README.md を使用してください"
    ((ERROR_COUNT++))
    continue
  fi

  # kebab-case チェック (index.md, README.md, CONTRIBUTING.md は除外)
  if [[ ! "$basename" =~ ^(index|README|CONTRIBUTING)\.md$ ]]; then
    if [[ ! "$basename" =~ ^[a-z0-9]+(-[a-z0-9]+)*\.md$ ]]; then
      echo -e "${RED}✗ ファイル名がkebab-caseではありません: $file${NC}"
      echo -e "  → 小文字英語とハイフンのみ使用してください (例: project-config.md)"
      ((ERROR_COUNT++))
    fi
  fi
done

# ============================================
# 2. フォルダ階層チェック (content/配下は1階層まで)
# ============================================
echo ""
echo "📂 [2/8] フォルダ階層チェック (1階層まで)..."
for file in $STAGED_MD_FILES; do
  # content/配下のファイルのみチェック
  if [[ "$file" =~ ^content/ ]]; then
    # content/xxx/yyy/zzz.md のような3階層以上を検出
    depth=$(echo "$file" | awk -F'/' '{print NF-1}')
    # content/xxx/file.md なら depth=2 (OK)
    # content/xxx/yyy/file.md なら depth=3 (NG)
    if [ "$depth" -gt 2 ]; then
      echo -e "${RED}✗ フォルダ階層が深すぎます (2階層以上): $file${NC}"
      echo -e "  → content/xxx/ の1階層までにしてください"
      ((ERROR_COUNT++))
    fi
  fi
done

# ============================================
# 3. index.md/README.md の詳細ドキュメントチェック
# ============================================
echo ""
echo "📄 [3/8] index.md/README.md の詳細ドキュメントチェック..."
for file in $STAGED_MD_FILES; do
  basename=$(basename "$file")

  if [[ "$basename" =~ ^(index|README)\.md$ ]]; then
    # frontmatter除去後の行数をカウント
    line_count=$(awk '
      BEGIN { in_frontmatter=0; content_lines=0 }
      /^---$/ {
        if (NR==1) { in_frontmatter=1; next }
        else if (in_frontmatter) { in_frontmatter=0; next }
      }
      !in_frontmatter && NF > 0 { content_lines++ }
      END { print content_lines }
    ' "$file")

    # 50行以上は詳細ドキュメントの可能性
    if [ "$line_count" -gt 50 ]; then
      echo -e "${YELLOW}⚠ index.md/README.mdが長すぎます (${line_count}行): $file${NC}"
      echo -e "  → ナビゲーション専用にしてください（目安: 50行以下）"
      echo -e "  → 詳細ドキュメントは個別ファイルに分けてください"
      # 警告のみ、エラーにはしない
    fi
  fi
done

# ============================================
# 4. タイトル重複チェック (frontmatter title vs H1)
# ============================================
echo ""
echo "🔤 [4/8] タイトル重複チェック (frontmatter vs H1)..."
for file in $STAGED_MD_FILES; do
  # frontmatterからtitleを抽出
  frontmatter_title=$(awk '
    BEGIN { in_fm=0 }
    /^---$/ {
      if (NR==1) { in_fm=1; next }
      else if (in_fm) { exit }
    }
    in_fm && /^title:/ {
      sub(/^title: */, "");
      gsub(/"/, "");
      print;
      exit
    }
  ' "$file")

  # 本文のH1を抽出
  h1_title=$(awk '
    BEGIN { in_fm=0; found_h1=0 }
    /^---$/ {
      if (NR==1) { in_fm=1; next }
      else if (in_fm) { in_fm=0; next }
    }
    !in_fm && !found_h1 && /^# / {
      sub(/^# */, "");
      print;
      found_h1=1;
      exit
    }
  ' "$file")

  # 両方存在し、一致する場合は重複
  if [ -n "$frontmatter_title" ] && [ -n "$h1_title" ]; then
    if [ "$frontmatter_title" = "$h1_title" ]; then
      echo -e "${RED}✗ タイトルが重複しています: $file${NC}"
      echo -e "  frontmatter: $frontmatter_title"
      echo -e "  H1見出し: $h1_title"
      echo -e "  → H1見出しを削除してください（Quartzが自動的にtitleを表示します）"
      ((ERROR_COUNT++))
    fi
  fi
done

# ============================================
# 5. 日付フォーマットチェック (YYYY-MM-DD)
# ============================================
echo ""
echo "📅 [5/8] 日付フォーマットチェック (YYYY-MM-DD)..."
for file in $STAGED_MD_FILES; do
  # frontmatterのdate行を抽出
  date_line=$(awk '
    BEGIN { in_fm=0 }
    /^---$/ {
      if (NR==1) { in_fm=1; next }
      else if (in_fm) { exit }
    }
    in_fm && /^date:/ { print; exit }
  ' "$file")

  if [ -n "$date_line" ]; then
    # YYYY-MM-DD形式チェック
    if ! echo "$date_line" | grep -qE 'date: *[0-9]{4}-[0-9]{2}-[0-9]{2}'; then
      echo -e "${RED}✗ 日付フォーマットが不正: $file${NC}"
      echo -e "  現在: $date_line"
      echo -e "  → YYYY-MM-DD形式を使用してください (例: 2026-02-17)"
      ((ERROR_COUNT++))
    fi
  fi
done

# ============================================
# 6. コードブロック言語指定チェック
# ============================================
echo ""
echo "💻 [6/8] コードブロック言語指定チェック..."
for file in $STAGED_MD_FILES; do
  # ```のみで言語指定がない行を検出
  unspecified_code_blocks=$(awk '
    BEGIN { in_fm=0; line_num=0 }
    /^---$/ {
      if (NR==1) { in_fm=1; next }
      else if (in_fm) { in_fm=0; next }
    }
    !in_fm {
      line_num++
      if (/^```$/) {
        print line_num
      }
    }
  ' "$file")

  if [ -n "$unspecified_code_blocks" ]; then
    echo -e "${YELLOW}⚠ 言語指定のないコードブロック: $file${NC}"
    echo -e "  行番号: $(echo $unspecified_code_blocks | tr '\n' ' ')"
    echo -e "  → コードブロックには言語を指定してください (例: \`\`\`python)"
    # 警告のみ、エラーにはしない
  fi
done

# ============================================
# 7. タグ小文字チェック
# ============================================
echo ""
echo "🏷️  [7/8] タグ小文字チェック..."
for file in $STAGED_MD_FILES; do
  # frontmatterのtags配列を抽出して大文字チェック
  uppercase_tags=$(awk '
    BEGIN { in_fm=0; in_tags=0 }
    /^---$/ {
      if (NR==1) { in_fm=1; next }
      else if (in_fm) { exit }
    }
    in_fm && /^tags:/ { in_tags=1; next }
    in_fm && in_tags && /^  -/ {
      tag = $2
      gsub(/"/, "", tag)
      if (tag ~ /[A-Z]/) {
        print tag
      }
      next
    }
    in_fm && in_tags && /^[a-z]/ { in_tags=0 }
  ' "$file")

  if [ -n "$uppercase_tags" ]; then
    echo -e "${RED}✗ タグに大文字が含まれています: $file${NC}"
    echo -e "  タグ: $(echo $uppercase_tags | tr '\n' ' ')"
    echo -e "  → タグは小文字英語のみ使用してください"
    ((ERROR_COUNT++))
  fi
done

# ============================================
# 8. プロモーショナル表現チェック
# ============================================
echo ""
echo "📢 [8/8] プロモーショナル表現チェック..."

PROMO_WORDS=("完全ガイド" "完全検証" "完全網羅" "究極" "最強" "完璧")

for file in $STAGED_MD_FILES; do
  for word in "${PROMO_WORDS[@]}"; do
    if grep -q "$word" "$file"; then
      echo -e "${YELLOW}⚠ プロモーショナル表現を検出: $file${NC}"
      echo -e "  キーワード: $word"
      echo -e "  → 客観的な表現を使用してください (例: '完全ガイド' → 'ガイド')"
      # 警告のみ、エラーにはしない
      break
    fi
  done
done

# ============================================
# 結果サマリー
# ============================================
echo ""
echo "========================================"
if [ $ERROR_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ CONTRIBUTING.mdルールチェック: OK${NC}"
  echo "========================================"
  exit 0
else
  echo -e "${RED}✗ CONTRIBUTING.mdルールチェック: ${ERROR_COUNT}個のエラー${NC}"
  echo "========================================"
  echo ""
  echo "修正後、再度コミットしてください。"
  echo "詳細: content/guides/contributing.md を参照"
  exit 1
fi
