import React, { useState, useEffect } from 'react';
import { DashboardContainer, DashboardHeader, DashboardGrid } from '@/components/ui/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSweetStore } from '@/store/sweetStore';
import { SweetForm } from '@/components/sweet';
import { IconCandy, IconPlus, IconEdit, IconTrash, IconRefresh } from '@tabler/icons-react';
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
    const { sweets, fetchSweets, isLoading } = useSweetStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

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

    return (
        <DashboardContainer>
            <DashboardHeader
                title="Admin Panel"
                description="Manage your sweet shop inventory"
                action={
                    <div className="flex gap-2">
                        <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
                            <IconRefresh className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                            <DialogTrigger asChild>
                                <Button>
                                    <IconPlus className="h-4 w-4 mr-2" />
                                    Add New Sweet
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Sweet</DialogTitle>
                                </DialogHeader>
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
                        <p className="text-sm text-muted-foreground mb-4">
                            Add, edit, and remove sweets from your inventory. All changes will be reflected immediately on the dashboard.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" variant="default">
                                        <IconPlus className="h-4 w-4 mr-2" />
                                        Add New Sweet
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <IconRefresh className="h-4 w-4 mr-2" />
                                Refresh Inventory
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                disabled
                            >
                                <IconTrash className="h-4 w-4 mr-2" />
                                Bulk Delete (Coming Soon)
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
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium">{sweet.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {sweet.category} • ₹{sweet.price.toFixed(2)} • {sweet.quantity} in stock
                                            </p>
                                            {sweet.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {sweet.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingSweet(sweet)}
                                            >
                                                <IconEdit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled
                                            >
                                                <IconTrash className="h-4 w-4" />
                                            </Button>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Sweet</DialogTitle>
                    </DialogHeader>
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