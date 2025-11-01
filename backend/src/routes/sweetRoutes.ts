/**
 * @file Express router defining endpoints for managing sweets.
 */
import { Router } from "express";
import { SweetController } from "../controllers/sweetController";
import { validate } from "../middleware/validation";
import { authenticate, requireAdmin } from "../middleware/auth";
import {
	CreateSweetSchema,
	UpdateSweetSchema,
	SearchSweetSchema,
} from "../types";

/** Router instance responsible for sweet-related endpoints. */
const router = Router();
const sweetController = new SweetController();

/** All sweet routes require an authenticated user. */
router.use(authenticate);

/** POST /api/sweets: Add a new sweet. */
router.post("/", validate(CreateSweetSchema), sweetController.createSweet);

/** GET /api/sweets: View a list of all available sweets. */
router.get("/", sweetController.getAllSweets);

/** GET /api/sweets/search: Search for sweets by name, category, or price range. */
router.get(
	"/search",
	validate(SearchSweetSchema, { query: true }),
	sweetController.searchSweets
);

/** PUT /api/sweets/:id: Update an existing sweet's details. */
router.put("/:id", validate(UpdateSweetSchema), sweetController.updateSweet);

/** DELETE /api/sweets/:id: Delete a sweet (Admin only). */
router.delete("/:id", requireAdmin, sweetController.deleteSweet);

export default router;
