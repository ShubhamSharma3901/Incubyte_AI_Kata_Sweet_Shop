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

/**
 * Simple 404 Not Found component
 */
const NotFoundError: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => window.history.back()} variant="outline">
                        Go Back
                    </Button>
                    <Button onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export { ErrorMessage, NotFoundError }