import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const EmbedUrls: QuartzTransformerPlugin = () => {
  return {
    name: "EmbedUrls",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, _file) => {
            visit(tree, "paragraph", (node) => {
              if (node.children.length === 1 && node.children[0].type === "text") {
                const text = node.children[0].value.trim()

                // YouTube URL detection
                const youtubeMatch = text.match(
                  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
                )
                if (youtubeMatch) {
                  const videoId = youtubeMatch[3]
                  node.type = "html" as any
                  node.children = []
                  ;(node as any).value = `<div class="embed-container"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
                  return
                }

                // Twitter/X URL detection
                const twitterMatch = text.match(
                  /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/
                )
                if (twitterMatch) {
                  const tweetId = twitterMatch[4]
                  node.type = "html" as any
                  node.children = []
                  ;(node as any).value = `<div class="embed-container"><blockquote class="twitter-tweet"><a href="${text}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`
                  return
                }

                // GitHub repository URL detection
                const githubMatch = text.match(
                  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/
                )
                if (githubMatch) {
                  const owner = githubMatch[2]
                  const repo = githubMatch[3]
                  node.type = "html" as any
                  node.children = []
                  ;(node as any).value = `<div class="github-embed"><a href="${text}" target="_blank" rel="noopener noreferrer"><div style="border: 1px solid var(--lightgray); border-radius: 6px; padding: 16px; margin: 16px 0;"><strong>${owner}/${repo}</strong><br><span style="color: var(--gray); font-size: 0.9rem;">View on GitHub →</span></div></a></div>`
                  return
                }

                // Zenn article URL detection
                const zennMatch = text.match(
                  /^https?:\/\/zenn\.dev\/([a-zA-Z0-9_-]+)\/(articles|books|scraps)\/([a-zA-Z0-9_-]+)/
                )
                if (zennMatch) {
                  node.type = "html" as any
                  node.children = []
                  ;(node as any).value = `<div class="zenn-embed"><a href="${text}" target="_blank" rel="noopener noreferrer"><div style="border: 1px solid var(--lightgray); border-radius: 6px; padding: 16px; margin: 16px 0;"><span style="color: var(--gray); font-size: 0.9rem;">📝 Zenn →</span><br><strong>${text}</strong></div></a></div>`
                  return
                }
              }
            })
          }
        },
      ]
    },
  }
}
