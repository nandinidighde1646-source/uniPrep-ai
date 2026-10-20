
import { Router } from "express";

import {
  getPublishedTests,
  getPublishedTestById,
  getAllTestsForAdmin,
  createTest,
  publishTest,
  deleteTest,
  startAttempt,
  submitAttempt,
  getAttemptResult,
} from "../controllers/mockTests.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// Student routes
router.get("/", authenticate, getPublishedTests);
router.get("/:id", authenticate, getPublishedTestById);
router.post("/:id/attempts", authenticate, startAttempt);
router.post("/attempts/:attemptId/submit", authenticate, submitAttempt);
router.get("/attempts/:attemptId/result", authenticate, getAttemptResult);

// Admin routes
router.get("/admin/all", authenticate, requireAdmin, getAllTestsForAdmin);
router.post("/", authenticate, requireAdmin, createTest);
router.patch("/:id/publish", authenticate, requireAdmin, publishTest);
router.delete("/:id", authenticate, requireAdmin, deleteTest);

export default router;
