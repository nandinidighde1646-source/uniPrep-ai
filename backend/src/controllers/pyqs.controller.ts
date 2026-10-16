import { Request, Response } from "express";
import * as pyqService from "../services/pyqs.service.js";

// Get all PYQs
export const getAllPYQs = async (
  req: Request,
  res: Response
) => {
  try {
    const pyqs = await pyqService.getAllPYQs();

    res.status(200).json({
      success: true,
      data: pyqs,
    });
  } catch (error: any) {
  console.error("Create PYQ Error:", error);

  res.status(500).json({
    success: false,
    message: "Failed to create PYQ",
    error: error?.message || error,
  });
}
};

// Get PYQ by ID
export const getPYQById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const pyq = await pyqService.getPYQById(id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pyq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch PYQ",
    });
  }
};

// Create PYQ

export const createPYQ = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, subject, semester, branch, year } = req.body;

    const fileUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/pyqs/${req.file.filename}`
      : req.body.fileUrl;

    if (!title || !subject || !semester || !branch || !year || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, subject, semester, branch, exam year, and PDF are required.",
      });
    }

    const pyq = await pyqService.createPYQ({
      title,
      subject,
      semester: Number(semester),
      branch,
      year: Number(year),
      fileUrl,
    });

    return res.status(201).json({
      success: true,
      data: pyq,
    });
  } catch (error) {
    console.error("Create PYQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create PYQ",
    });
  }
};


// Update PYQ
export const updatePYQ = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const pyq = await pyqService.updatePYQ(id, req.body);

    res.status(200).json({
      success: true,
      data: pyq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update PYQ",
    });
  }
};

// Delete PYQ
export const deletePYQ = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await pyqService.deletePYQ(id);

    res.status(200).json({
      success: true,
      message: "PYQ deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete PYQ",
    });
  }
};