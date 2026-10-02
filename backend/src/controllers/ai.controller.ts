import { Request, Response } from "express";
import { generateAIResponse } from "../services/ai.service.js";

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const response = await generateAIResponse(message, history);

    return res.status(200).json({
      message: response,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};