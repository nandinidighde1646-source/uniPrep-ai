
import prisma from "../prisma/prisma.js";

interface CreatePYQData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  year: number;
  fileUrl: string;
}

// Get all PYQs, newest exam year first
export const getAllPYQs = async () => {
  return await prisma.pYQ.findMany({
    orderBy: [
      { year: "desc" },
      { createdAt: "desc" },
    ],
  });
};

// Get PYQ by ID
export const getPYQById = async (id: number) => {
  return await prisma.pYQ.findUnique({
    where: { id },
  });
};

// Create PYQ
export const createPYQ = async (data: CreatePYQData) => {
  return await prisma.pYQ.create({
    data,
  });
};

// Update PYQ
export const updatePYQ = async (
  id: number,
  data: Partial<CreatePYQData>
) => {
  return await prisma.pYQ.update({
    where: { id },
    data,
  });
};

// Delete PYQ
export const deletePYQ = async (id: number) => {
  return await prisma.pYQ.delete({
    where: { id },
  });
};
