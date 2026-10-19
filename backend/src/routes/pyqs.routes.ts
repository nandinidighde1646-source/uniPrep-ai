
import { Router } from "express";

import {
  uploadPYQPdf,
  uploadBulkPYQFiles,
} from "../middlewares/upload.middleware.js";

import {
  getAllPYQs,
  getPYQById,
  createPYQ,
  updatePYQ,
  deletePYQ,
  bulkCreatePYQs,
  bulkUploadPYQs,
} from "../controllers/pyqs.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// Everyone who is logged in can view PYQs
router.get("/", authenticate, getAllPYQs);
router.get("/:id", authenticate, getPYQById);

// Admin only: existing bulk import using metadata and file URLs
router.post(
  "/bulk",
  authenticate,
  requireAdmin,
  bulkCreatePYQs
);

// Admin only: upload one CSV and up to 20 PDF files
router.post(
  "/bulk-upload",
  authenticate,
  requireAdmin,
  uploadBulkPYQFiles.fields([
    { name: "csv", maxCount: 1 },
    { name: "pdfs", maxCount: 20 },
  ]),
  bulkUploadPYQs
);

// Admin only: upload a single PYQ PDF
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadPYQPdf.single("pdf"),
  createPYQ
);

// Admin only: update a PYQ
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updatePYQ
);

// Admin only: delete a PYQ
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deletePYQ
);

export default router;
