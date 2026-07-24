import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * PC: 중앙 모달 / 모바일: 하단 바텀시트
 */
export function AdaptivePanel({
  open,
  onClose,
  title,
  children,
  labelledById,
}) {
  const titleId = useId()
  const headingId = labelledById || titleId
  const closeRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previouslyFocused.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus()
    })

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (
        previouslyFocused.current instanceof HTMLElement &&
        document.contains(previouslyFocused.current)
      ) {
        previouslyFocused.current.focus()
      }
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-ink/40 transition-opacity"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-card bg-card shadow-softHover md:max-h-[85vh] md:rounded-card md:animate-none"
      >
        <div className="flex justify-center pt-3 md:hidden" aria-hidden>
          <span className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-border/80 px-5 pb-4 pt-3 md:px-6 md:pt-5">
          <h2 id={headingId} className="text-lg font-bold text-ink">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-button text-ink-muted transition hover:bg-secondary-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="닫기"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 md:px-6 md:pb-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
