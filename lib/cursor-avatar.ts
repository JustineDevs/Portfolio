export const CURSOR_AVATAR_HOVER = "portfolio:cursor-avatar-hover" as const

export type CursorAvatarHoverDetail = { over: boolean }

export function setAvatarCursorHover(over: boolean) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<CursorAvatarHoverDetail>(CURSOR_AVATAR_HOVER, {
      detail: { over },
    })
  )
}
