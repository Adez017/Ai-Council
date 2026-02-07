import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title?: string
  message: string
  type?: "error" | "warning" | "info"
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const icons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const variants = {
  error: "destructive" as const,
  warning: "warning" as const,
  info: "info" as const,
}

export function ErrorMessage({
  title,
  message,
  type = "error",
  action,
  className,
}: ErrorMessageProps) {
  const Icon = icons[type]

  return (
    <Alert variant={variants[type]} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        <p className="mb-3">{message}</p>
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-2"
          >
            {action.label}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({
  title = "No data found",
  message = "There's nothing here yet.",
  action,
}: {
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Info className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{message}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
