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
        header: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
        body: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
        code: "Menlo, Monaco, Courier New, monospace",
      },
      colors: {
        lightMode: {
          light: "#FFF",
          lightgray: "#F5F5F5",
          gray: "#B5B5B5",
          darkgray: "#828282",
          dark: "#0F0F0F",
          secondary: "#6A8695",
          tertiary: "#556B77",
          highlight: "rgba(106, 134, 149, 0.15)",
          textHighlight: "#E6E6E6",
        },
        darkMode: {
          light: "#262626",
          lightgray: "#212121",
          gray: "#595959",
          darkgray: "#999999",
          dark: "#D1D1D1",
          secondary: "#889EAA",
          tertiary: "#ACBBC3",
          highlight: "rgba(136, 158, 170, 0.15)",
          textHighlight: "#333333",
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
        keepBackground: false,
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
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
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
