import prisma from "../prisma/prisma.js";

export const getAllUsersService = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserByIdService = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

export const deleteUserService = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};