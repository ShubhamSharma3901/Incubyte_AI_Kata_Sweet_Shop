import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    message: string
    onRetry?: () => void
}

const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
    ({ className, title = "Something went wrong", message, onRetry, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center",
                className
            )}
            {...props}
        >
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-destructive">{title}</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
                {onRetry && (
                    <Button variant="outline" onClick={onRetry} className="mt-4">
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    )
)
ErrorMessage.displayName = "ErrorMessage"

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends React.Component<
    React.PropsWithChildren<{}>,
    ErrorBoundaryState
> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <ErrorMessage
                        title="Application Error"
                        message="An unexpected error occurred. Please refresh the page and try again."
                        onRetry={() => window.location.reload()}
                    />
                </div>
            )
        }

        return this.props.children
    }
}

export { ErrorMessage, ErrorBoundary }