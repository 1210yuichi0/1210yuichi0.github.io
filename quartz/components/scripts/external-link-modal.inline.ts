// External link modal - Zenn style
document.addEventListener("nav", () => {
  const modal = document.createElement("div")
  modal.id = "external-link-modal"
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <h3>外部サイトへ移動します</h3>
        </div>
        <div class="modal-body">
          <p class="modal-description">以下のリンクを開こうとしています：</p>
          <div class="modal-url"></div>
        </div>
        <div class="modal-footer">
          <button class="modal-button modal-button-cancel">キャンセル</button>
          <button class="modal-button modal-button-confirm">リンクを開く</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  let pendingUrl = ""

  function showModal(url: string) {
    pendingUrl = url
    const urlElement = modal.querySelector(".modal-url")
    if (urlElement) {
      urlElement.textContent = url
    }
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  function hideModal() {
    modal.classList.remove("active")
    document.body.style.overflow = ""
    pendingUrl = ""
  }

  const cancelButton = modal.querySelector(".modal-button-cancel")
  const confirmButton = modal.querySelector(".modal-button-confirm")
  const overlay = modal.querySelector(".modal-overlay")

  cancelButton?.addEventListener("click", hideModal)
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      hideModal()
    }
  })

  confirmButton?.addEventListener("click", () => {
    if (pendingUrl) {
      window.open(pendingUrl, "_blank", "noopener,noreferrer")
    }
    hideModal()
  })

  // Intercept external links
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement
    const link = target.closest("a.external")

    if (link && link instanceof HTMLAnchorElement) {
      const href = link.href
      const currentHost = window.location.host

      // Check if it's truly external
      try {
        const linkUrl = new URL(href)
        if (linkUrl.host !== currentHost) {
          e.preventDefault()
          e.stopPropagation()
          showModal(href)
        }
      } catch (err) {
        // Invalid URL, let it proceed normally
      }
    }
  })

  // Cleanup
  window.addCleanup?.(() => {
    modal.remove()
  })
})
