import React, { useState, useEffect } from 'react';
import { DashboardContainer, DashboardHeader, DashboardGrid } from '@/components/ui/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSweetStore } from '@/store/sweetStore';
import { SweetForm } from '@/components/sweet';
import { IconCandy, IconPlus, IconEdit, IconTrash, IconRefresh, IconAlertTriangle } from '@tabler/icons-react';
import type { Sweet } from '@/types';

/**
 * Admin management page component
 * Provides administrative tools for managing sweets inventory
 * Only available to users with admin role
 * 
 * Features:
 * - Add new sweets with comprehensive form validation
 * - Edit existing sweets with pre-populated data
 * - Delete sweets with confirmation (to be implemented in task 12)
 * - Real-time inventory management
 * 
 * Scope: Add, Edit, Delete sweets (Requirements 6, 7, 8)
 */
export const AdminPage: React.FC = () => {
    const { toast } = useToast();
    const { sweets, fetchSweets, deleteSweet, isLoading } = useSweetStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState<{ [key: string]: boolean }>({});
    const [deletingSweet, setDeletingSweet] = useState<string | null>(null);

    // Fetch sweets on component mount
    useEffect(() => {
        fetchSweets().catch((error) => {
            toast({
                title: "Error Loading Sweets",
                description: "Failed to load sweets inventory. Please refresh the page.",
                variant: "destructive",
            });
        });
    }, [fetchSweets, toast]);

    /**
     * Handles successful form submission for adding sweets
     */
    const handleAddSuccess = () => {
        setShowAddForm(false);
        // Refresh the sweets list to show the new sweet
        fetchSweets();
    };

    /**
     * Handles successful form submission for editing sweets
     */
    const handleEditSuccess = () => {
        setEditingSweet(null);
        // Refresh the sweets list to show updated data
        fetchSweets();
    };

    /**
     * Handles cancelling the edit operation
     */
    const handleEditCancel = () => {
        setEditingSweet(null);
    };

    /**
     * Handles refreshing the sweets inventory
     */
    const handleRefresh = async () => {
        try {
            await fetchSweets();
            toast({
                title: "Inventory Refreshed",
                description: "Sweet inventory has been updated successfully.",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Refresh Failed",
                description: "Failed to refresh inventory. Please try again.",
                variant: "destructive",
            });
        }
    };

    /**
     * Handle sweet deletion with proper error handling and UI feedback
     */
    const handleDelete = async (sweet: Sweet) => {
        setDeletingSweet(sweet.id);

        try {
            await deleteSweet(sweet.id);
            toast({
                title: "Sweet deleted successfully",
                description: `${sweet.name} has been removed from inventory`,
            });
            setShowDeleteDialog(prev => ({ ...prev, [sweet.id]: false }));
        } catch (error: any) {
            toast({
                title: "Delete failed",
                description: error.response?.data?.message ?? "Failed to delete sweet. Please try again.",
                variant: "destructive",
            });
        } finally {
            setDeletingSweet(null);
        }
    };

    return (
        <DashboardContainer>
            <DashboardHeader
                title="Admin Panel"
                description="Manage your sweet shop inventory"
                action={
                    <div className="flex flex-col gap-2 xs:flex-row">
                        <Button onClick={handleRefresh} variant="outline" disabled={isLoading} className="touch-target w-full xs:w-auto">
                            <IconRefresh className="h-4 w-4 mr-2" />
                            <span className="hidden xs:inline">Refresh</span>
                        </Button>
                        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                            <DialogTrigger asChild>
                                <Button className="touch-target w-full xs:w-auto">
                                    <IconPlus className="h-4 w-4 mr-2" />
                                    <span className="xs:hidden">Add Sweet</span>
                                    <span className="hidden xs:inline">Add New Sweet</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="mx-3 w-[calc(100vw-1.5rem)] max-w-2xl safe-area-inset sm:mx-auto sm:w-full">
                                <SweetForm
                                    onSuccess={handleAddSuccess}
                                    onCancel={() => setShowAddForm(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <DashboardGrid cols={1}>
                {/* Sweet Management Overview */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Sweet Management</CardTitle>
                        <IconCandy className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-responsive-sm text-muted-foreground mb-4">
                            Add, edit, and remove sweets from your inventory. All changes will be reflected immediately on the dashboard.
                        </p>
                        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                                <DialogTrigger asChild>
                                    <Button className="touch-target w-full h-10 xs:h-11" variant="default">
                                        <IconPlus className="h-4 w-4 mr-2" />
                                        <span className="text-responsive-sm">Add New Sweet</span>
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                            <Button
                                className="touch-target w-full h-10 xs:h-11"
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <IconRefresh className="h-4 w-4 mr-2" />
                                <span className="text-responsive-sm">Refresh Inventory</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Current Inventory */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Current Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Loading inventory...</p>
                            </div>
                        ) : sweets.length === 0 ? (
                            <div className="text-center py-8">
                                <IconCandy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground mb-2">No sweets in inventory</p>
                                <p className="text-sm text-muted-foreground">Add your first sweet to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sweets.map((sweet) => (
                                    <div
                                        key={sweet.id}
                                        className="flex flex-col gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors xs:flex-row xs:items-center xs:justify-between xs:p-4"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-responsive-sm">{sweet.name}</h4>
                                            <p className="text-responsive-xs text-muted-foreground">
                                                {sweet.category} • ₹{sweet.price.toFixed(2)} • {sweet.quantity} in stock
                                            </p>
                                            {sweet.description && (
                                                <p className="text-responsive-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {sweet.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 xs:ml-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingSweet(sweet)}
                                                className="touch-target flex-1 xs:flex-none"
                                            >
                                                <IconEdit className="h-4 w-4 mr-2 xs:mr-0" />
                                                <span className="xs:hidden">Edit</span>
                                            </Button>
                                            <Dialog
                                                open={showDeleteDialog[sweet.id] || false}
                                                onOpenChange={(open) => setShowDeleteDialog(prev => ({ ...prev, [sweet.id]: open }))}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={deletingSweet === sweet.id || isLoading}
                                                        className="touch-target flex-1 xs:flex-none"
                                                    >
                                                        {deletingSweet === sweet.id ? (
                                                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent xs:h-4 xs:w-4" />
                                                        ) : (
                                                            <>
                                                                <IconTrash className="h-4 w-4 mr-2 xs:mr-0" />
                                                                <span className="xs:hidden">Delete</span>
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
                                                            onClick={() => setShowDeleteDialog(prev => ({ ...prev, [sweet.id]: false }))}
                                                            disabled={deletingSweet === sweet.id}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDelete(sweet)}
                                                            disabled={deletingSweet === sweet.id}
                                                            className="w-full sm:w-auto"
                                                        >
                                                            {deletingSweet === sweet.id ? (
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DashboardGrid>

            {/* Edit Sweet Dialog */}
            <Dialog open={!!editingSweet} onOpenChange={(open) => !open && setEditingSweet(null)}>
                <DialogContent className="mx-3 w-[calc(100vw-1.5rem)] max-w-2xl safe-area-inset sm:mx-auto sm:w-full">
                    {editingSweet && (
                        <SweetForm
                            sweet={editingSweet}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </DialogContent>
            </Dialog>



        </DashboardContainer>
    );
};