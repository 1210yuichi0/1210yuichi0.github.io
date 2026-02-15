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

    // Icon and label configuration
    const typeConfig = {
      "ai-generated": {
        icon: "🤖",
        label: "AI Generated",
        className: "ai-generated",
      },
      "human-written": {
        icon: "✍️",
        label: "Human Written",
        className: "human-written",
      },
      "ai-assisted": {
        icon: "🤝",
        label: "AI Assisted",
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
            | {reviewed ? "✓ Reviewed" : "Unreviewed"}
          </span>
        )}
      </div>
    )
  }

  Authorship.css = style

  return Authorship
}) satisfies QuartzComponentConstructor
