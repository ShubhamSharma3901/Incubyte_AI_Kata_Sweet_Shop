import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4
}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
    ({ className, cols = 3, children, ...props }, ref) => {
        const gridCols = {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "grid gap-6",
                    gridCols[cols],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
DashboardGrid.displayName = "DashboardGrid"

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    action?: React.ReactNode
}

const DashboardHeader = React.forwardRef<HTMLDivElement, DashboardHeaderProps>(
    ({ className, title, description, action, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex items-center justify-between space-y-2", className)}
            {...props}
        >
            <div>
                <h1 className="text-3xl font-bold font-display tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
)
DashboardHeader.displayName = "DashboardHeader"

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    description,
    icon,
    trend
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon && <div className="text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
                <div className="flex items-center space-x-1 text-xs">
                    <span
                        className={cn(
                            "font-medium",
                            trend.isPositive ? "text-green-600" : "text-red-600"
                        )}
                    >
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                </div>
            )}
        </CardContent>
    </Card>
)

interface DashboardContainerProps extends React.HTMLAttributes<HTMLDivElement> { }

const DashboardContainer = React.forwardRef<HTMLDivElement, DashboardContainerProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("space-y-6", className)}
            {...props}
        >
            {children}
        </div>
    )
)
DashboardContainer.displayName = "DashboardContainer"

export {
    DashboardGrid,
    DashboardHeader,
    DashboardContainer,
    StatsCard
}