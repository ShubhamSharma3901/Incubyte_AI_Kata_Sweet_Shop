/**
 * @file Controller handling inventory adjustments for sweets.
 */
import { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";
import { PurchaseSweetInput, RestockSweetInput } from "../types";

const inventoryService = new InventoryService();

/**
 * Translates inventory service calls into HTTP responses.
 */
export class InventoryController {
	/**
	 * Handles sweet purchase requests by reducing available quantity.
	 *
	 * @param req Express request containing sweet identifier and quantity.
	 * @param res Express response returning the updated sweet.
	 */
	async purchaseSweet(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { quantity } = req.body as PurchaseSweetInput;
			const sweet = await inventoryService.purchaseSweet(id, quantity);

			res.json({
				message: "Sweet purchased successfully",
				sweet,
			});
		} catch (error: any) {
			switch (error.message) {
				case "Sweet not found":
					res.status(404).json({ error: error.message });
					break;
				case "Insufficient quantity available":
				case "Purchase quantity must be greater than zero":
					res.status(400).json({ error: error.message });
					break;
				default:
					res.status(500).json({ error: "Unable to process purchase request" });
			}
		}
	}

	/**
	 * Handles restock requests by increasing available quantity.
	 *
	 * @param req Express request containing sweet identifier and quantity.
	 * @param res Express response returning the updated sweet.
	 */
	async restockSweet(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { quantity } = req.body as RestockSweetInput;
			const sweet = await inventoryService.restockSweet(id, quantity);

			res.json({
				message: "Sweet restocked successfully",
				sweet,
			});
		} catch (error: any) {
			switch (error.message) {
				case "Sweet not found":
					res.status(404).json({ error: error.message });
					break;
				case "Restock quantity must be greater than zero":
					res.status(400).json({ error: error.message });
					break;
				default:
					res.status(500).json({ error: "Unable to process restock request" });
			}
		}
	}
}
