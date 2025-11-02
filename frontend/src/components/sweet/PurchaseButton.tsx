import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useSweetStore } from "@/store/sweetStore";
import { useToast } from "@/hooks/use-toast";
import {
    IconShoppingCart,
    IconPackage,
    IconMinus,
    IconPlus,
    IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { Sweet } from "@/types";

interface PurchaseButtonProps {
    sweet: Sweet;
    className?: string;
    variant?: "default" | "outline" | "secondary";
    size?: "sm" | "default" | "lg";
    showQuantitySelector?: boolean;
}

/**
 * PurchaseButton component with quantity-based state management
 * 
 * Features:
 * - Quantity selection with validation
 * - Purchase confirmation dialog
 * - Real-time stock updates
 * - Out-of-stock handling
 * - Success/error feedback
 * 
 * @param sweet - Sweet item to purchase
 * @param className - Additional CSS classes
 * @param variant - Button variant style
 * @param size - Button size
 * @param showQuantitySelector - Whether to show quantity selection dialog
 */
export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
    sweet,
    className,
    variant = "default",
    size = "default",
    showQuantitySelector = true,
}) => {
    const { purchaseSweet, isLoading } = useSweetStore();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const isOutOfStock = sweet.quantity <= 0;
    const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
    const maxQuantity = Math.min(sweet.quantity, 10); // Limit to 10 items per purchase
    const priceInRupees = sweet.price && !isNaN(sweet.price) ? Math.round(sweet.price * 83) : 0;
    const totalPrice = priceInRupees * selectedQuantity;

    /**
     * Handle direct purchase without quantity selection
     */
    const handleDirectPurchase = async () => {
        if (isOutOfStock) return;

        setIsPurchasing(true);
        try {
            await purchaseSweet(sweet.id, 1);

            // Show success state briefly
            setPurchaseSuccess(true);
            setTimeout(() => setPurchaseSuccess(false), 2000);

            toast({
                title: "Purchase successful!",
                description: `You purchased 1 ${sweet.name} for ₹${priceInRupees}`,
            });
        } catch (error: any) {
            toast({
                title: "Purchase failed",
                description:
                    error.response?.data?.message ??
                    "Failed to purchase sweet. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPurchasing(false);
        }
    };

    /**
     * Handle purchase with quantity selection
     */
    const handleQuantityPurchase = async () => {
        if (isOutOfStock || selectedQuantity <= 0) return;

        setIsPurchasing(true);
        try {
            await purchaseSweet(sweet.id, selectedQuantity);

            // Show success state and close dialog
            setPurchaseSuccess(true);
            setIsDialogOpen(false);

            // Reset quantity for next purchase
            setSelectedQuantity(1);

            setTimeout(() => setPurchaseSuccess(false), 2000);

            toast({
                title: "Purchase successful!",
                description: `You purchased ${selectedQuantity} ${sweet.name}${selectedQuantity > 1 ? 's' : ''} for ₹${totalPrice}`,
            });
        } catch (error: any) {
            toast({
                title: "Purchase failed",
                description:
                    error.response?.data?.message ??
                    "Failed to purchase sweet. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPurchasing(false);
        }
    };

    /**
     * Adjust selected quantity with bounds checking
     */
    const adjustQuantity = (delta: number) => {
        const newQuantity = selectedQuantity + delta;
        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            setSelectedQuantity(newQuantity);
        }
    };

    /**
     * Handle manual quantity input
     */
    const handleQuantityInput = (value: string) => {
        const quantity = parseInt(value) || 0;
        if (quantity >= 1 && quantity <= maxQuantity) {
            setSelectedQuantity(quantity);
        }
    };

    // Show success state briefly after purchase
    if (purchaseSuccess) {
        return (
            <Button
                className={cn(
                    "flex items-center justify-center gap-2 transition-all duration-200",
                    "bg-green-600 hover:bg-green-600 text-white",
                    className
                )}
                size={size}
                disabled
            >
                <IconCheck className="h-4 w-4" />
                Purchased!
            </Button>
        );
    }

    // Out of stock state
    if (isOutOfStock) {
        return (
            <Button
                className={cn(
                    "flex items-center justify-center gap-2 cursor-not-allowed",
                    className
                )}
                variant="secondary"
                size={size}
                disabled
            >
                <IconPackage className="h-4 w-4" />
                Out of Stock
            </Button>
        );
    }

    // Simple purchase button (no quantity selection)
    if (!showQuantitySelector) {
        return (
            <Button
                onClick={handleDirectPurchase}
                disabled={isOutOfStock || isPurchasing || isLoading}
                className={cn(
                    "flex items-center justify-center gap-2 transition-all duration-200",
                    className
                )}
                variant={variant}
                size={size}
            >
                {isPurchasing || isLoading ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing…
                    </>
                ) : (
                    <>
                        <IconShoppingCart className="h-4 w-4" />
                        Buy Now • ₹{priceInRupees}
                    </>
                )}
            </Button>
        );
    }

    // Purchase button with quantity selection dialog
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={isOutOfStock || isLoading}
                    className={cn(
                        "flex items-center justify-center gap-2 transition-all duration-200",
                        className
                    )}
                    variant={variant}
                    size={size}
                >
                    <IconShoppingCart className="h-4 w-4" />
                    Purchase • ₹{priceInRupees}
                    {isLowStock && (
                        <Badge variant="outline" className="ml-2 text-xs">
                            Only {sweet.quantity} left
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="mx-3 w-[calc(100vw-1.5rem)] max-w-md safe-area-inset sm:mx-auto sm:w-full">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="flex items-center gap-2 text-responsive-lg">
                        <IconShoppingCart className="h-4 w-4 xs:h-5 xs:w-5" />
                        Purchase {sweet.name}
                    </DialogTitle>
                    <DialogDescription className="text-responsive-sm">
                        Select the quantity you want to purchase.
                        {isLowStock && (
                            <span className="text-orange-600 font-medium">
                                {" "}Only {sweet.quantity} items remaining in stock.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-3 xs:space-y-4 xs:py-4">
                    {/* Sweet info */}
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 xs:p-4">
                        <div>
                            <h4 className="font-semibold text-responsive-sm">{sweet.name}</h4>
                            <p className="text-responsive-xs text-muted-foreground">₹{priceInRupees} per item</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {sweet.quantity} in stock
                        </Badge>
                    </div>

                    {/* Quantity selector */}
                    <div className="space-y-2">
                        <label className="text-responsive-sm font-medium">Quantity</label>
                        <div className="flex items-center gap-2 xs:gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => adjustQuantity(-1)}
                                disabled={selectedQuantity <= 1}
                                className="touch-target h-8 w-8 p-0 xs:h-9 xs:w-9"
                            >
                                <IconMinus className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                            </Button>

                            <Input
                                type="number"
                                min="1"
                                max={maxQuantity}
                                value={selectedQuantity}
                                onChange={(e) => handleQuantityInput(e.target.value)}
                                className="w-16 text-center text-responsive-sm xs:w-20"
                            />

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => adjustQuantity(1)}
                                disabled={selectedQuantity >= maxQuantity}
                                className="touch-target h-8 w-8 p-0 xs:h-9 xs:w-9"
                            >
                                <IconPlus className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                            </Button>
                        </div>

                        {selectedQuantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                                Maximum {maxQuantity} items per purchase
                            </p>
                        )}
                    </div>

                    {/* Total price */}
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-primary/5 xs:p-4">
                        <span className="font-medium text-responsive-sm">Total Price:</span>
                        <span className="text-responsive-lg font-bold">₹{totalPrice}</span>
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 xs:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isPurchasing}
                        className="touch-target w-full xs:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleQuantityPurchase}
                        disabled={isPurchasing || selectedQuantity <= 0 || selectedQuantity > sweet.quantity}
                        className="touch-target flex w-full items-center gap-2 xs:w-auto"
                    >
                        {isPurchasing ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent xs:h-4 xs:w-4" />
                                <span className="text-responsive-xs">Processing…</span>
                            </>
                        ) : (
                            <>
                                <IconShoppingCart className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                                <span className="text-responsive-xs">
                                    Purchase {selectedQuantity > 1 ? `${selectedQuantity} items` : '1 item'}
                                </span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};