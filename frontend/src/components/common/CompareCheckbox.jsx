import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * 비교 선택 체크 UI.
 * parent 상태 반영 전에 화면이 한 박자 늦지 않도록 낙관적 표시를 씁니다.
 */
export function CompareCheckbox({ checked, disabled, label, onToggle }) {
  const [optimistic, setOptimistic] = useState(null)
  const shown = optimistic ?? checked

  useEffect(() => {
    setOptimistic(null)
  }, [checked])

  return (
    <button
      type="button"
      aria-pressed={shown}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        if (disabled) return
        setOptimistic(!(optimistic ?? checked))
        onToggle()
      }}
      className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${
          shown ? 'border-primary bg-primary' : 'border-border bg-card'
        }`}
        aria-hidden
      >
        {shown ? (
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        ) : null}
      </span>
    </button>
  )
}
