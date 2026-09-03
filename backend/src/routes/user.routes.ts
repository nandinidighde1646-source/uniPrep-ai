import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", authenticate, requireAdmin, getAllUsers);
router.get("/:id", authenticate, requireAdmin, getUserById);
router.delete("/:id", authenticate, requireAdmin, deleteUser);

export default router;