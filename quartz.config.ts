import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Scrap Notes",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ja-JP",
    baseUrl: "1210yuichi0.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        body: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        code: "SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, monospace",
      },
      colors: {
        lightMode: {
          light: "#FFF",
          lightgray: "#F5F5F5",
          gray: "#E5E5E5",
          darkgray: "#767676",
          dark: "#0F0F0F",
          secondary: "#607987",
          tertiary: "#556B77",
          highlight: "hsla(201,50%,40%,30%)",
          textHighlight: "#E6E6E6",
        },
        darkMode: {
          light: "#081d35",      // Zenn: メイン背景
          lightgray: "#ecf5ff",  // Graph lines - white
          gray: "#ecf5ff",       // Graph lines active - white
          darkgray: "#a4bcd5",   // Zenn: セカンダリテキスト
          dark: "#ecf5ff",       // Zenn: メインテキスト
          secondary: "#3ea8ff",  // Zenn: プライマリアクセント
          tertiary: "#0f83fd",   // Zenn: リンク
          highlight: "rgba(62, 168, 255, 0.2)",
          textHighlight: "#162c49",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: true,
      }),
      Plugin.EmbedUrls(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({
        maxDepth: 2,
      }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Mermaid(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        sort: (f1, f2) => {
          // Sort by date descending (most recent first)
          if (f1.dates && f2.dates) {
            const date1 = f1.dates.modified || f1.dates.published || f1.dates.created
            const date2 = f2.dates.modified || f2.dates.published || f2.dates.created
            return date2.getTime() - date1.getTime()
          } else if (f1.dates && !f2.dates) {
            return -1
          } else if (!f1.dates && f2.dates) {
            return 1
          }
          // If no dates, sort alphabetically by title
          const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
          const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
          return f1Title.localeCompare(f2Title)
        },
      }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
