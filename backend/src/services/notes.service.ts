import prisma from "../prisma/prisma.js";

export const getAllNotesService = async () => {
  return await prisma.note.findMany();
};
/*
export const createNoteService = async (
  title: string,
  subject: string,
  semester: number,
  branch: string,
  fileUrl: string
) => {
  const note = await prisma.note.create({
    data: {
      title,
      subject,
      semester,
      branch,
      fileUrl,
    },
  });

  return note;
};
*/
export const createNoteService = async (
  title: string,
  subject: string,
  semester: number,
  branch: string,
  fileUrl: string
) => {
  console.log({
    title,
    subject,
    semester,
    branch,
    fileUrl,
  });

  return await prisma.note.create({
    data: {
      title,
      subject,
      semester,
      branch,
      fileUrl,
    },
  });
};

export const updateNoteService = async (
  id: number,
  title: string,
  subject: string,
  semester: number,
  branch: string,
  fileUrl: string
) => {
  const updatedNote = await prisma.note.update({
    where: {
      id,
    },
    data: {
      title,
      subject,
      semester,
      branch,
      fileUrl,
    },
  });

  return updatedNote;
};

export const deleteNoteService = async (id: number) => {
  await prisma.note.delete({
    where: {
      id,
    },
  });
};

export const getNoteByIdService = async (id: number) => {
  return await prisma.note.findUnique({
    where: {
      id,
    },
  });
};