import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/api/users");
  return response.data.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};