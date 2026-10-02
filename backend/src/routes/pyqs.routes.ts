import { Router } from "express";

import {
  getAllPYQs,
  getPYQById,
  createPYQ,
  updatePYQ,
  deletePYQ,
} from "../controllers/pyqs.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// Everyone who is logged in can view PYQs
router.get("/", authenticate, getAllPYQs);
router.get("/:id", authenticate, getPYQById);

// Admin only
router.post("/", authenticate, requireAdmin, createPYQ);
router.put("/:id", authenticate, requireAdmin, updatePYQ);
router.delete("/:id", authenticate, requireAdmin, deletePYQ);

export default router;