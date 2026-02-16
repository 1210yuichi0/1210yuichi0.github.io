---
title: Claude Code MCP設定ガイド
draft: false
tags:
  - claude-code
  - mcp
  - browser-automation
  - playwright
authorship:
  type: ai-generated
  model: Claude Sonnet 4.5
  date: 2026-02-15
  reviewed: false
---

## 概要

Claude Codeで使用するMCP (Model Context Protocol) サーバーの設定方法をまとめたドキュメント。

## ブラウザ自動化: Playwright MCP

### 推奨サーバー

**Microsoft公式 Playwright MCP** を使用する。

- パッケージ名: `@playwright/mcp@latest`
- リポジトリ: https://github.com/microsoft/playwright-mcp
- 特徴: アクセシビリティツリーベースで動作、スクリーンショット不要

### セットアップ手順

#### 1. 設定ファイルの編集

```bash
# Claude Desktop設定ファイルのパス
~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### 2. 設定内容

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  },
  "preferences": {
    "sidebarMode": "chat",
    "coworkScheduledTasksEnabled": false
  }
}
```

#### 3. Claude Desktopを再起動

設定反映のため、Claude Desktopアプリを完全に再起動する。

### 使用例

再起動後、以下のような操作が可能：

- Webページへのナビゲーション
- 要素のクリック・入力
- スクリーンショット取得
- JavaScriptの実行
- モバイルビューのシミュレーション

## 代替案（非推奨）

### Puppeteer MCP

⚠️ **非推奨**: `@modelcontextprotocol/server-puppeteer` は deprecated（2025年以降）

代わりに Microsoft Playwright MCP を使用すること。

## トラブルシューティング

### MCPサーバーが起動しない

1. Node.jsのバージョン確認: `node --version`（v18以上推奨）
2. npxが正しく動作するか確認: `npx --version`
3. Claude Desktopの完全再起動
4. 設定ファイルのJSON形式を確認

### npmパスの問題

nvmを使用している場合、グローバルパスを確認：

```bash
npm root -g
# 例: /Users/yada/.nvm/versions/node/v22.20.0/lib/node_modules
```

## 参考資料

- [Microsoft Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [MCP Specification](https://modelcontextprotocol.io)

## 更新履歴

- 2026-02-15: Microsoft Playwright MCP設定を追加
- 2026-02-15: Puppeteer MCPを非推奨に変更
