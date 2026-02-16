# Scrap Notes - Quartz Makefile

CONTENT_PATH := ./content

.PHONY: help build serve dev publish clean

help: ## このヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## サイトをビルド
	@echo "🔨 Building site..."
	@npx quartz build
	@echo "✅ Build complete!"

serve: ## ローカルサーバーで実行
	@echo "🚀 Starting local server..."
	@npx quartz build --serve

dev: serve ## serveのエイリアス

publish: ## GitHub にプッシュしてデプロイ
	@echo "📤 Publishing to GitHub..."
	@git add .
	@git commit -m "docs: update content\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\nCo-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>" || echo "No changes to commit"
	@git push
	@echo "✅ Published!"

clean: ## 生成ファイルを削除
	@echo "🧹 Cleaning..."
	@rm -rf public
	@echo "✅ Clean complete!"
