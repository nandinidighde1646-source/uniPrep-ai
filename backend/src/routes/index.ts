import { Router } from "express";

const router = Router();

// Home Route
router.get("/", (req, res) => {
  res.send("UniPrep AI Backend Running...");
});

// About Route
router.get("/about", (req, res) => {
  res.json({
    project: "UniPrep AI",
    version: "1.0.0",
    backend: "Node.js + Express + TypeScript",
  });
});

export default router;