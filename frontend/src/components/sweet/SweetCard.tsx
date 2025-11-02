import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PurchaseButton } from "./PurchaseButton";
import { useSweetStore } from "@/store/sweetStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import {
	IconEdit,
	IconTrash,
	IconPackage,
	IconTrendingUp,
	IconAlertTriangle
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
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const isOutOfStock = sweet.quantity <= 0;
	const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
	const priceInRupees = sweet.price && !isNaN(sweet.price) ? sweet.price : 0;

	/**
	 * Handle sweet deletion with proper error handling and UI feedback
	 * Requirement 8.3: Send delete request to backend API
	 * Requirement 8.4: Remove sweet from display immediately on success
	 * Requirement 8.5: Display error message on failure
	 */
	const handleDelete = async () => {
		setIsDeleting(true);

		try {
			await deleteSweet(sweet.id);
			toast({
				title: "Sweet deleted successfully",
				description: `${sweet.name} has been removed from inventory`,
			});
			setShowDeleteDialog(false);
		} catch (error: any) {
			toast({
				title: "Delete failed",
				description:
					error.response?.data?.message ??
					"Failed to delete sweet. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card
			className={cn(
				"group relative flex h-full flex-col overflow-hidden border border-border bg-card",
				"shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1",
				"min-h-[280px] xs:min-h-[320px] sm:min-h-[360px]",
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

			<CardHeader className="space-y-3 pb-3 pt-4 xs:space-y-4 xs:pb-4 xs:pt-6">
				<Badge
					variant="outline"
					className="w-fit rounded-full px-2 py-1 text-xs font-medium capitalize xs:px-3 xs:py-1.5"
				>
					{sweet.category}
				</Badge>

				<CardTitle className="text-responsive-lg font-bold text-foreground leading-tight">
					{sweet.name}
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-3 pb-4 xs:gap-4 xs:pb-5">
				{/* Price section */}
				<div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 xs:p-4">
					<span className="text-xs text-muted-foreground font-medium">Price</span>
					<span className="text-lg font-bold text-foreground xs:text-xl sm:text-2xl">
						₹{priceInRupees}
					</span>
				</div>

				{/* Stock status */}
				<div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 xs:p-4">
					<div className="flex items-center gap-2 xs:gap-3">
						<div className={cn(
							"w-2.5 h-2.5 rounded-full xs:w-3 xs:h-3",
							isOutOfStock ? "bg-red-500" : isLowStock ? "bg-orange-500" : "bg-green-500"
						)} />
						<span className="text-xs font-medium text-foreground xs:text-sm">
							{isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
						</span>
					</div>
					<div className="flex items-center gap-1.5 xs:gap-2">
						<IconPackage className="h-3.5 w-3.5 text-muted-foreground xs:h-4 xs:w-4" />
						<span className="text-xs font-semibold text-foreground xs:text-sm">
							{sweet.quantity} units
						</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex flex-col gap-2 pb-4 pt-2 xs:gap-3 xs:pb-6">
				{user && !isAdmin && (
					<PurchaseButton
						sweet={sweet}
						className="touch-target h-10 w-full rounded-xl text-xs font-semibold xs:h-12 xs:text-sm"
						showQuantitySelector={true}
					/>
				)}

				{/* Admin controls - Requirement 8.1: Provide delete button for admin users */}
				{isAdmin && (
					<div className="flex w-full gap-2 xs:gap-3">
						<Button
							variant="outline"
							onClick={() =>
								toast({
									title: "Edit coming soon",
									description: "Editing sweets will be available in a future release.",
								})
							}
							className="touch-target flex-1 h-9 rounded-xl text-xs xs:h-10 xs:text-sm"
						>
							<IconEdit className="mr-1.5 h-3.5 w-3.5 xs:mr-2 xs:h-4 xs:w-4" />
							Edit
						</Button>

						{/* Delete confirmation dialog - Requirement 8.2: Display confirmation dialog */}
						<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
							<DialogTrigger asChild>
								<Button
									variant="destructive"
									className="touch-target flex-1 h-9 rounded-xl text-xs xs:h-10 xs:text-sm"
									disabled={isLoading || isDeleting}
								>
									{isDeleting ? (
										<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent xs:h-4 xs:w-4" />
									) : (
										<>
											<IconTrash className="mr-1.5 h-3.5 w-3.5 xs:mr-2 xs:h-4 xs:w-4" />
											Delete
										</>
									)}
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle className="flex items-center gap-2">
										<IconAlertTriangle className="h-5 w-5 text-destructive" />
										Confirm Deletion
									</DialogTitle>
									<DialogDescription className="text-left">
										Are you sure you want to delete <strong>"{sweet.name}"</strong>?
										This action cannot be undone and will permanently remove this sweet from your inventory.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter className="flex-col sm:flex-row gap-2">
									<Button
										variant="outline"
										onClick={() => setShowDeleteDialog(false)}
										disabled={isDeleting}
										className="w-full sm:w-auto"
									>
										Cancel
									</Button>
									<Button
										variant="destructive"
										onClick={handleDelete}
										disabled={isDeleting}
										className="w-full sm:w-auto"
									>
										{isDeleting ? (
											<>
												<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
												Deleting...
											</>
										) : (
											<>
												<IconTrash className="mr-2 h-4 w-4" />
												Delete Sweet
											</>
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				)}
			</CardFooter>
		</Card>
	);
};