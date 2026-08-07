import { Request, Response } from "express";

import {
  getAllNotesService,
  getNoteByIdService,
  createNoteService,
  updateNoteService,
  deleteNoteService,
} from "../services/notes.service.js";

export const getAllNotes = async (req: Request, res: Response) => {
  const notes = await getAllNotesService();

  res.status(200).json({
    success: true,
    data: notes,
  });
};

export const getNoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const note = await getNoteByIdService(Number(id));

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  res.status(200).json({
    success: true,
    data: note,
  });
};

export const createNote = async (req: Request, res: Response) => {
  const {
    title,
    subject,
    semester,
    branch,
    fileUrl,
  } = req.body;

  const note = await createNoteService(
    title,
    subject,
    Number(semester),
    branch,
    fileUrl
  );

  res.status(201).json({
    success: true,
    data: note,
  });
}

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    title,
    subject,
    semester,
    branch,
    fileUrl,
  } = req.body;

  const updatedNote = await updateNoteService(
    Number(id),
    title,
    subject,
    Number(semester),
    branch,
    fileUrl
  );

  res.status(200).json({
    success: true,
    data: updatedNote,
  });
};
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteNoteService(Number(id));

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
};