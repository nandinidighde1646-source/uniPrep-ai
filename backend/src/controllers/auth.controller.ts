import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
   console.log("Register body:", req.body);
   
  try {
   //const { name, email, password } = req.body;
    if (!req.body) {
  return res.status(400).json({
    success: false,
    message: "Request body is missing.",
  });
}

const {name, email, password } = req.body;
    const user = await registerService(name, email, password);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Login failed",
    });
  }
};