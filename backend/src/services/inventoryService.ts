/**
 * @file Service encapsulating inventory adjustments for sweets.
 */
import prisma from "../config/database";

export class InventoryService {
	/**
	 * Decrements inventory for the specified sweet.
	 *
	 * @param id Identifier of the sweet to purchase.
	 * @param quantity Number of units to deduct from stock.
	 * @returns Updated sweet record after purchase.
	 */
	async purchaseSweet(id: string, quantity: number) {
		if (!Number.isInteger(quantity) || quantity <= 0) {
			throw new Error("Purchase quantity must be greater than zero");
		}

		const sweet = await prisma.sweet.findUnique({ where: { id } });

		if (!sweet) {
			throw new Error("Sweet not found");
		}

		if (sweet.quantity < quantity) {
			throw new Error("Insufficient quantity available");
		}

		const updatedSweet = await prisma.sweet.update({
			where: { id },
			data: {
				quantity: sweet.quantity - quantity,
			},
		});

		return updatedSweet;
	}

	/**
	 * Increases inventory for the specified sweet.
	 *
	 * @param id Identifier of the sweet to restock.
	 * @param quantity Number of units to add to stock.
	 * @returns Updated sweet record after restock.
	 */
	async restockSweet(id: string, quantity: number) {
		if (!Number.isInteger(quantity) || quantity <= 0) {
			throw new Error("Restock quantity must be greater than zero");
		}

		const sweet = await prisma.sweet.findUnique({ where: { id } });

		if (!sweet) {
			throw new Error("Sweet not found");
		}

		const updatedSweet = await prisma.sweet.update({
			where: { id },
			data: {
				quantity: sweet.quantity + quantity,
			},
		});

		return updatedSweet;
	}
}
