import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
    ({ className, size = "md", ...props }, ref) => {
        const sizeClasses = {
            sm: "h-4 w-4",
            md: "h-6 w-6",
            lg: "h-8 w-8"
        }

        return (
            <div
                ref={ref}
                className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size], className)}
                {...props}
            >
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
)
LoadingSpinner.displayName = "LoadingSpinner"

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    )
)
LoadingSkeleton.displayName = "LoadingSkeleton"

const LoadingCard = () => (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-3">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
            <LoadingSkeleton className="h-8 w-full" />
        </div>
    </div>
)

export { LoadingSpinner, LoadingSkeleton, LoadingCard }