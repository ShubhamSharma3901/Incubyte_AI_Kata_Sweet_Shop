/**
 * @file Unit tests for SweetService business logic.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SweetService } from '../../services/sweetService';

vi.mock('../../config/database', () => ({
    default: {
        sweet: {
            findUnique: vi.fn(),
            create: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

import prisma from '../../config/database';

describe('SweetService', () => {
    let sweetService: SweetService;
    const mockPrisma = prisma as any;

    const sampleSweet = {
        id: 'sweet-123',
        name: 'Ladoo',
        category: 'Festival',
        price: 10,
        quantity: 50,
    };

    beforeEach(() => {
        sweetService = new SweetService();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('createSweet', () => {
        it('creates a sweet when the name is unique', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(null);
            mockPrisma.sweet.create.mockResolvedValueOnce(sampleSweet);

            const result = await sweetService.createSweet({
                name: sampleSweet.name,
                category: sampleSweet.category,
                price: sampleSweet.price,
                quantity: sampleSweet.quantity,
            });

            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledWith({
                where: { name: sampleSweet.name },
            });
            expect(mockPrisma.sweet.create).toHaveBeenCalledWith({
                data: {
                    name: sampleSweet.name,
                    category: sampleSweet.category,
                    price: sampleSweet.price,
                    quantity: sampleSweet.quantity,
                },
            });
            expect(result).toEqual(sampleSweet);
        });

        it('throws when a sweet with the same name already exists', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);

            await expect(
                sweetService.createSweet({
                    name: sampleSweet.name,
                    category: 'Any',
                    price: 5,
                    quantity: 10,
                })
            ).rejects.toThrow('Sweet with this name already exists');

            expect(mockPrisma.sweet.create).not.toHaveBeenCalled();
        });
    });

    describe('getAllSweets', () => {
        it('returns sweets ordered by creation date', async () => {
            mockPrisma.sweet.findMany.mockResolvedValueOnce([sampleSweet]);

            const result = await sweetService.getAllSweets();

            expect(mockPrisma.sweet.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
            });
            expect(result).toEqual([sampleSweet]);
        });
    });

    describe('searchSweets', () => {
        it('applies filters for name, category, and price range', async () => {
            mockPrisma.sweet.findMany.mockResolvedValueOnce([sampleSweet]);

            const searchInput = {
                name: 'ladoo',
                category: 'fest',
                minPrice: 5,
                maxPrice: 15,
            };

            await sweetService.searchSweets(searchInput);

            expect(mockPrisma.sweet.findMany).toHaveBeenCalledWith({
                where: {
                    name: { contains: searchInput.name, mode: 'insensitive' },
                    category: { contains: searchInput.category, mode: 'insensitive' },
                    price: { gte: searchInput.minPrice, lte: searchInput.maxPrice },
                },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('handles searches with only minimum price', async () => {
            mockPrisma.sweet.findMany.mockResolvedValueOnce([]);

            await sweetService.searchSweets({ minPrice: 20 });

            expect(mockPrisma.sweet.findMany).toHaveBeenCalledWith({
                where: {
                    price: { gte: 20 },
                },
                orderBy: { createdAt: 'desc' },
            });
        });
    });

    describe('getSweetById', () => {
        it('returns the sweet when found', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);

            const result = await sweetService.getSweetById(sampleSweet.id);

            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
            });
            expect(result).toEqual(sampleSweet);
        });

        it('throws when the sweet does not exist', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(null);

            await expect(sweetService.getSweetById('missing-id')).rejects.toThrow(
                'Sweet not found'
            );
        });
    });

    describe('updateSweet', () => {
        it('updates a sweet when it exists and name is unchanged', async () => {
            const updatedSweet = { ...sampleSweet, price: 15 };

            mockPrisma.sweet.findUnique
                .mockResolvedValueOnce(sampleSweet); // Fetch by id
            mockPrisma.sweet.update.mockResolvedValueOnce(updatedSweet);

            const result = await sweetService.updateSweet(sampleSweet.id, {
                price: 15,
            });

            expect(mockPrisma.sweet.findUnique).toHaveBeenNthCalledWith(1, {
                where: { id: sampleSweet.id },
            });
            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledTimes(1);
            expect(mockPrisma.sweet.update).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
                data: { price: 15 },
            });
            expect(result).toEqual(updatedSweet);
        });

        it('throws when the sweet is not found', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(null);

            await expect(
                sweetService.updateSweet('missing-id', { price: 12 })
            ).rejects.toThrow('Sweet not found');

            expect(mockPrisma.sweet.update).not.toHaveBeenCalled();
        });

        it('throws when updating to a name that already exists', async () => {
            mockPrisma.sweet.findUnique
                .mockResolvedValueOnce(sampleSweet) // Fetch by id
                .mockResolvedValueOnce({ id: 'other-id', name: 'Barfi' }); // Conflicting name

            await expect(
                sweetService.updateSweet(sampleSweet.id, { name: 'Barfi' })
            ).rejects.toThrow('Sweet with this name already exists');

            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledTimes(2);
            expect(mockPrisma.sweet.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteSweet', () => {
        it('deletes an existing sweet', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(sampleSweet);
            mockPrisma.sweet.delete.mockResolvedValueOnce(sampleSweet);

            const result = await sweetService.deleteSweet(sampleSweet.id);

            expect(mockPrisma.sweet.findUnique).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
            });
            expect(mockPrisma.sweet.delete).toHaveBeenCalledWith({
                where: { id: sampleSweet.id },
            });
            expect(result).toEqual(sampleSweet);
        });

        it('throws when trying to delete a missing sweet', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValueOnce(null);

            await expect(sweetService.deleteSweet('missing-id')).rejects.toThrow(
                'Sweet not found'
            );

            expect(mockPrisma.sweet.delete).not.toHaveBeenCalled();
        });
    });
});
