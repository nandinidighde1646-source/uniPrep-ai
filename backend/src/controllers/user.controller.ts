import { Request, Response } from "express";

import {
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
} from "../services/user.service";

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await deleteUserService(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};