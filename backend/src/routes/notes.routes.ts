
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
import { uploadNotePdf } from "../middlewares/upload.middleware.js";

const router = Router();

// Logged-in users can view notes
router.get("/", authenticate, getAllNotes);
router.get("/:id", authenticate, getNoteById);

// Admin only: create a note with a PDF upload
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadNotePdf.single("pdf"),
  createNote
);

// Admin only: update or delete notes
router.put("/:id", authenticate, requireAdmin, updateNote);
router.delete("/:id", authenticate, requireAdmin, deleteNote);

export default router;
