import React from 'react';
import { DashboardContainer, DashboardHeader, DashboardGrid } from '@/components/ui/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { IconCandy, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

/**
 * Admin management page component
 * Provides administrative tools for managing sweets inventory
 * Only available to users with admin role
 * 
 * Scope: Add, Edit, Delete sweets (Requirements 6, 7, 8)
 */
export const AdminPage: React.FC = () => {
    const { toast } = useToast();

    const handleAddSweet = () => {
        toast({
            title: "Add Sweet Feature",
            description: "Add sweet functionality will be implemented in a future update",
        });
    };

    const handleManageSweets = () => {
        toast({
            title: "Manage Sweets Feature",
            description: "Sweet management functionality will be implemented in a future update",
        });
    };

    return (
        <DashboardContainer>
            <DashboardHeader
                title="Admin Panel"
                description="Manage your sweet shop inventory"
                action={
                    <Button onClick={handleAddSweet}>
                        <IconPlus className="h-4 w-4 mr-2" />
                        Add New Sweet
                    </Button>
                }
            />

            <DashboardGrid cols={1}>
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
                            <Button
                                className="w-full"
                                onClick={handleAddSweet}
                                variant="default"
                            >
                                <IconPlus className="h-4 w-4 mr-2" />
                                Add New Sweet
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleManageSweets}
                            >
                                <IconEdit className="h-4 w-4 mr-2" />
                                Edit Sweets
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleManageSweets}
                            >
                                <IconTrash className="h-4 w-4 mr-2" />
                                Remove Sweets
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </DashboardGrid>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Available Admin Functions
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Add new sweets to the inventory with name, category, price, and quantity</li>
                    <li>• Edit existing sweet details including pricing and stock levels</li>
                    <li>• Delete sweets from the inventory (with confirmation)</li>
                    <li>• All changes are immediately visible to customers on the main dashboard</li>
                </ul>
            </div>
        </DashboardContainer>
    );
};