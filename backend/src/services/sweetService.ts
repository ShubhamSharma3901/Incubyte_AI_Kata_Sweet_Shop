/**
 * @file Service encapsulating business logic for sweet management.
 */
import prisma from "../config/database";
import { CreateSweetInput, UpdateSweetInput, SearchSweetInput } from "../types";

/**
 * Provides CRUD operations for sweets backed by Prisma ORM.
 */
export class SweetService {
	/**
	 * Creates a new sweet when the name is unique.
	 *
	 * @param sweetData Validated input describing the sweet.
	 * @returns Promise resolving to the persisted sweet record.
	 */
	async createSweet(sweetData: CreateSweetInput) {
		// Check if sweet with same name already exists
		const existingSweet = await prisma.sweet.findUnique({
			where: { name: sweetData.name },
		});

		if (existingSweet) {
			throw new Error("Sweet with this name already exists");
		}

		const sweet = await prisma.sweet.create({
			data: sweetData,
		});

		return sweet;
	}

	/**
	 * Retrieves all sweets sorted by their creation timestamp.
	 *
	 * @returns Promise resolving to an array of sweets.
	 */
	async getAllSweets() {
		const sweets = await prisma.sweet.findMany({
			orderBy: { createdAt: "desc" },
		});

		return sweets;
	}

	/**
	 * Searches sweets using optional name, category, and price filters.
	 *
	 * @param searchData Query parameters describing desired filters.
	 * @returns Promise resolving to sweets that match the criteria.
	 */
	async searchSweets(searchData: SearchSweetInput) {
		const where: any = {};

		if (searchData.name) {
			where.name = {
				contains: searchData.name,
				mode: "insensitive",
			};
		}

		if (searchData.category) {
			where.category = {
				contains: searchData.category,
				mode: "insensitive",
			};
		}

		if (
			searchData.minPrice !== undefined ||
			searchData.maxPrice !== undefined
		) {
			where.price = {};
			if (searchData.minPrice !== undefined) {
				where.price.gte = searchData.minPrice;
			}
			if (searchData.maxPrice !== undefined) {
				where.price.lte = searchData.maxPrice;
			}
		}

		const sweets = await prisma.sweet.findMany({
			where,
			orderBy: { createdAt: "desc" },
		});

		return sweets;
	}

	/**
	 * Looks up a sweet by its identifier, throwing when not found.
	 *
	 * @param id Unique identifier of the sweet.
	 * @returns Promise resolving to the matching sweet.
	 */
	async getSweetById(id: string) {
		const sweet = await prisma.sweet.findUnique({
			where: { id },
		});

		if (!sweet) {
			throw new Error("Sweet not found");
		}

		return sweet;
	}

	/**
	 * Updates an existing sweet, ensuring name uniqueness when changed.
	 *
	 * @param id Identifier for the sweet to update.
	 * @param updateData Partial fields describing the new values.
	 * @returns Promise resolving to the updated sweet.
	 */
	async updateSweet(id: string, updateData: UpdateSweetInput) {
		// Check if sweet exists
		const existingSweet = await prisma.sweet.findUnique({
			where: { id },
		});

		if (!existingSweet) {
			throw new Error("Sweet not found");
		}

		// If name is being updated, check for conflicts
		if (updateData.name && updateData.name !== existingSweet.name) {
			const conflictingSweet = await prisma.sweet.findUnique({
				where: { name: updateData.name },
			});

			if (conflictingSweet) {
				throw new Error("Sweet with this name already exists");
			}
		}

		const updatedSweet = await prisma.sweet.update({
			where: { id },
			data: updateData,
		});

		return updatedSweet;
	}

	/**
	 * Deletes a sweet after ensuring it exists.
	 *
	 * @param id Identifier of the sweet to delete.
	 * @returns Promise resolving to the removed sweet record.
	 */
	async deleteSweet(id: string) {
		const existingSweet = await prisma.sweet.findUnique({
			where: { id },
		});

		if (!existingSweet) {
			throw new Error("Sweet not found");
		}

		const deletedSweet = await prisma.sweet.delete({
			where: { id },
		});

		return deletedSweet;
	}
}
