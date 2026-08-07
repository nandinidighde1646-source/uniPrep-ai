import { Router } from "express";
import {
  getAllPYQs,
  getPYQById,
  createPYQ,
  updatePYQ,
  deletePYQ,
} from "../controllers/pyqs.controller.js";

const router = Router();

router.get("/", getAllPYQs);
router.get("/:id", getPYQById);
router.post("/", createPYQ);
router.put("/:id", updatePYQ);
router.delete("/:id", deletePYQ);

export default router;