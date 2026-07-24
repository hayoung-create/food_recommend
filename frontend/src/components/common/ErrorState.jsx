import { CircleAlert } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({
  message = '문제가 발생했습니다.',
  onRetry,
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-4 border-danger/20 bg-danger-soft/40 px-6 py-12 text-center">
      <CircleAlert className="h-10 w-10 text-danger" aria-hidden />
      <p className="text-base font-semibold text-ink">{message}</p>
      {onRetry ? (
        <div className="w-full max-w-xs">
          <Button type="button" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      ) : null}
    </div>
  )
}
