import { Router } from "express";

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAllNotes);
router.get("/:id", authenticate, getNoteById);
router.post("/", authenticate, createNote);
router.put("/:id", authenticate, updateNote);
router.delete("/:id", authenticate, deleteNote);

export default router;