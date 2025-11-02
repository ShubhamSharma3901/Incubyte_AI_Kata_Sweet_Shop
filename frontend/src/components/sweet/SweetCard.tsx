import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchaseButton } from "./PurchaseButton";
import { useSweetStore } from "@/store/sweetStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import {
	IconEdit,
	IconTrash,
	IconPackage,
	IconTrendingUp
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { Sweet } from "@/types";

interface SweetCardProps {
	sweet: Sweet;
	className?: string;
	style?: React.CSSProperties;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, className, style }) => {
	const { deleteSweet, isLoading } = useSweetStore();
	const { user, isAdmin } = useAuthStore();
	const { toast } = useToast();

	const isOutOfStock = sweet.quantity <= 0;
	const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
	const priceInRupees = sweet.price && !isNaN(sweet.price) ? sweet.price : 0;

	const handleDelete = async () => {
		if (!window.confirm(`Delete \"${sweet.name}\"?`)) {
			return;
		}

		try {
			await deleteSweet(sweet.id);
			toast({
				title: "Sweet removed",
				description: `${sweet.name} has been deleted from inventory`,
			});
		} catch (error: any) {
			toast({
				title: "Delete failed",
				description:
					error.response?.data?.message ??
					"Failed to delete sweet. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card
			className={cn(
				"group relative flex h-full flex-col overflow-hidden border border-border bg-card",
				"shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1",
				className
			)}
			style={style}
		>
			{/* Trending badge for popular items */}
			{sweet.quantity < 10 && (
				<div className="absolute top-4 right-4 z-10">
					<Badge variant="secondary" className="text-xs font-medium">
						<IconTrendingUp className="h-3 w-3 mr-1" />
						Popular
					</Badge>
				</div>
			)}

			<CardHeader className="space-y-4 pb-4 pt-6">
				<Badge
					variant="outline"
					className="w-fit rounded-full px-3 py-1.5 text-xs font-medium capitalize"
				>
					{sweet.category}
				</Badge>

				<CardTitle className="text-xl font-bold text-foreground leading-tight">
					{sweet.name}
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-4 pb-5">
				{/* Price section */}
				<div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
					<span className="text-xs text-muted-foreground font-medium">Price</span>
					<span className="text-2xl font-bold text-foreground">
						₹{priceInRupees}
					</span>
				</div>

				{/* Stock status */}
				<div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
					<div className="flex items-center gap-3">
						<div className={cn(
							"w-3 h-3 rounded-full",
							isOutOfStock ? "bg-red-500" : isLowStock ? "bg-orange-500" : "bg-green-500"
						)} />
						<span className="text-sm font-medium text-foreground">
							{isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<IconPackage className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-semibold text-foreground">
							{sweet.quantity} units
						</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex flex-col gap-3 pb-6 pt-2">
				{user && !isAdmin && (
					<PurchaseButton
						sweet={sweet}
						className="h-12 w-full rounded-xl text-sm font-semibold"
						showQuantitySelector={true}
					/>
				)}

				{isAdmin && (
					<div className="flex w-full gap-3">
						<Button
							variant="outline"
							onClick={() =>
								toast({
									title: "Edit coming soon",
									description: "Editing sweets will be available in a future release.",
								})
							}
							className="flex-1 h-10 rounded-xl"
						>
							<IconEdit className="mr-2 h-4 w-4" />
							Edit
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							className="flex-1 h-10 rounded-xl"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							) : (
								<>
									<IconTrash className="mr-2 h-4 w-4" />
									Delete
								</>
							)}
						</Button>
					</div>
				)}
			</CardFooter>
		</Card>
	);
};