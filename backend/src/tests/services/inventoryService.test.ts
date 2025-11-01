/**
 * @file Unit tests for inventory-specific operations on sweets.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InventoryService } from '../../services/inventoryService';

vi.mock('../../config/database', () => ({
    default: {
        sweet: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

import prisma from '../../config/database';

describe('InventoryService', () => {
    let inventoryService: InventoryService;
    const mockPrisma = prisma as any;

    const sampleSweet = {
        id: 'sweet-123',
        name: 'Ladoo',
        category: 'Festival',
        price: 10,
        quantity: 50,
        description: 'Traditional sweet',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        inventoryService = new InventoryService();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    /** Purchase flow verifying stock is decremented appropriately. */
    describe('purchaseSweet', () => {
        it('reduces available quantity when enough stock exists', async () => {
            const quantityToPurchase = 5;
            const updatedSweet = { ...sampleSweet, quantity: sampleSweet.quantity - quantityToPurchase };

            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);
            mockPrisma.sweet.update.mockResolvedValueOnce(updatedSweet);

            const result = await inventoryService.purchaseSweet(sampleSweet.id, quantityToPurchase);

            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
            });
            expect(mockPrisma.sweet.update).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
                data: { quantity: updatedSweet.quantity },
            });
            expect(result).toEqual(updatedSweet);
        });

        it('throws when purchase quantity exceeds available stock', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);

            await expect(
                inventoryService.purchaseSweet(sampleSweet.id, sampleSweet.quantity + 1)
            ).rejects.toThrow('Insufficient quantity available');

            expect(mockPrisma.sweet.update).not.toHaveBeenCalled();
        });

        it('throws when the sweet being purchased does not exist', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(null);

            await expect(inventoryService.purchaseSweet('missing-id', 1)).rejects.toThrow('Sweet not found');
        });

        it('throws when purchase quantity is not a positive integer', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);

            await expect(inventoryService.purchaseSweet(sampleSweet.id, 0)).rejects.toThrow(
                'Purchase quantity must be greater than zero'
            );
        });
    });

    /** Restock flow verifying quantity increments correctly. */
    describe('restockSweet', () => {
        it('increases quantity by the supplied amount', async () => {
            const restockAmount = 20;
            const updatedSweet = { ...sampleSweet, quantity: sampleSweet.quantity + restockAmount };

            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);
            mockPrisma.sweet.update.mockResolvedValueOnce(updatedSweet);

            const result = await inventoryService.restockSweet(sampleSweet.id, restockAmount);

            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
            });
            expect(mockPrisma.sweet.update).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
                data: { quantity: updatedSweet.quantity },
            });
            expect(result).toEqual(updatedSweet);
        });

        it('throws when attempting to restock a missing sweet', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(null);

            await expect(inventoryService.restockSweet('missing-id', 5)).rejects.toThrow('Sweet not found');
        });

        it('throws when restock amount is not positive', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);

            await expect(inventoryService.restockSweet(sampleSweet.id, 0)).rejects.toThrow(
                'Restock quantity must be greater than zero'
            );
        });
    });
});
