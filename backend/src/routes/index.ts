/**
 * @file Root router that aggregates user and sweet domain routes.
 */
import { Router } from "express";
import userRoutes from "./userRoutes";
import sweetRoutes from "./sweetRoutes";
import inventoryRoutes from "./inventoryRoutes";

/** Primary API router instance. */
const router = Router();

router.use("/users", userRoutes);
router.use("/sweets", sweetRoutes);
router.use("/sweets", inventoryRoutes);

/** Lightweight health check accessible under the API namespace. */
router.get("/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		service: "Sweet Shop API",
	});
});

export default router;
