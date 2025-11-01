/**
 * @file Express router dedicated to sweet inventory management.
 */
import { Router } from "express";
import { InventoryController } from "../controllers/inventoryController";
import { validate } from "../middleware/validation";
import { authenticate, requireAdmin } from "../middleware/auth";
import { PurchaseSweetSchema, RestockSweetSchema } from "../types";

/** Router handling purchase and restock actions. */
const router = Router();
const inventoryController = new InventoryController();

/** Authenticate all inventory operations. */
router.use(authenticate);

/** POST /api/sweets/:id/purchase: Purchase inventory units. */
router.post(
	"/:id/purchase",
	validate(PurchaseSweetSchema),
	inventoryController.purchaseSweet.bind(inventoryController)
);

/** POST /api/sweets/:id/restock: Restock inventory (admin only). */
router.post(
	"/:id/restock",
	validate(RestockSweetSchema),
	requireAdmin,
	inventoryController.restockSweet.bind(inventoryController)
);

export default router;
