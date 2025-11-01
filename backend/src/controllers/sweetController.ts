/**
 * @file Controller layer translating SweetService results into HTTP responses.
 */
import { Request, Response } from "express";
import { SweetService } from "../services/sweetService";
import { SearchSweetInput, SearchSweetSchema } from "../types";

const sweetService = new SweetService();

/**
 * Handles incoming requests related to sweet catalog operations.
 */
export class SweetController {
	/**
	 * Persists a new sweet using the request body payload.
	 *
	 * @param req Express request containing sweet details.
	 * @param res Express response used to send creation status.
	 */
	async createSweet(req: Request, res: Response) {
		try {
			const sweet = await sweetService.createSweet(req.body);
			res.status(201).json({
				message: "Sweet created successfully",
				sweet,
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	/**
	 * Retrieves the current list of sweets in the catalog.
	 *
	 * @param req Express request object.
	 * @param res Express response returning the sweet collection.
	 */
	async getAllSweets(req: Request, res: Response) {
		try {
			const sweets = await sweetService.getAllSweets();
			res.json({ sweets });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	/**
	 * Executes a filtered search for sweets based on query parameters.
	 *
	 * @param req Express request containing search criteria.
	 * @param res Express response returning matched sweets.
	 */
	async searchSweets(req: Request, res: Response) {
		try {
			// Parse and validate query parameters (coerce types)
			const searchData = SearchSweetSchema.parse(req.query) as SearchSweetInput;
			const sweets = await sweetService.searchSweets(searchData);
			res.json({ sweets });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	/**
	 * Updates details of an existing sweet by identifier.
	 *
	 * @param req Express request containing ID parameter and update payload.
	 * @param res Express response returning the updated sweet.
	 */
	async updateSweet(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const sweet = await sweetService.updateSweet(id, req.body);
			res.json({
				message: "Sweet updated successfully",
				sweet,
			});
		} catch (error: any) {
			if (error.message === "Sweet not found") {
				res.status(404).json({ error: error.message });
			} else {
				res.status(400).json({ error: error.message });
			}
		}
	}

	/**
	 * Deletes the sweet referenced by the request path parameter.
	 *
	 * @param req Express request containing the sweet identifier.
	 * @param res Express response confirming deletion.
	 */
	async deleteSweet(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const sweet = await sweetService.deleteSweet(id);
			res.json({
				message: "Sweet deleted successfully",
				sweet,
			});
		} catch (error: any) {
			if (error.message === "Sweet not found") {
				res.status(404).json({ error: error.message });
			} else {
				res.status(500).json({ error: error.message });
			}
		}
	}
}
