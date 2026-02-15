import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/authorship.scss"

export default (() => {
  function Authorship({ fileData, displayClass }: QuartzComponentProps) {
    const authorship = fileData.frontmatter?.authorship

    if (!authorship) {
      return null
    }

    const { type, model, date, reviewed } = authorship

    // アイコンとラベルの設定
    const typeConfig = {
      "ai-generated": {
        icon: "🤖",
        label: "AI生成",
        className: "ai-generated",
      },
      "human-written": {
        icon: "✍️",
        label: "人間執筆",
        className: "human-written",
      },
      "ai-assisted": {
        icon: "🤝",
        label: "AI補助",
        className: "ai-assisted",
      },
    }

    const config = typeConfig[type as keyof typeof typeConfig]
    if (!config) {
      return null
    }

    return (
      <div class={classNames(displayClass, "authorship-badge", config.className)}>
        <span class="authorship-icon">{config.icon}</span>
        <span class="authorship-label">{config.label}</span>
        {model && <span class="authorship-model"> | {model}</span>}
        {date && <span class="authorship-date"> | {date}</span>}
        {reviewed !== undefined && (
          <span class="authorship-reviewed">
            {" "}
            | {reviewed ? "✓ レビュー済み" : "未レビュー"}
          </span>
        )}
      </div>
    )
  }

  Authorship.css = style

  return Authorship
}) satisfies QuartzComponentConstructor
