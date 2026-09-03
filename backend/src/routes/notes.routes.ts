import { Router } from "express";

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// Everyone who is logged in can view notes
router.get("/", authenticate, getAllNotes);
router.get("/:id", authenticate, getNoteById);

// Admin only
router.post("/", authenticate, requireAdmin, createNote);
router.put("/:id", authenticate, requireAdmin, updateNote);
router.delete("/:id", authenticate, requireAdmin, deleteNote);

export default router;