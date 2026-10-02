import { Router } from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/chat", authenticate, chatWithAI);

export default router;