import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/external-link-modal.inline"
import style from "./styles/external-link-modal.scss"

export default (() => {
  const ExternalLinkModal: QuartzComponent = (_props: QuartzComponentProps) => {
    return null
  }

  ExternalLinkModal.beforeDOMLoaded = script
  ExternalLinkModal.css = style

  return ExternalLinkModal
}) satisfies QuartzComponentConstructor
