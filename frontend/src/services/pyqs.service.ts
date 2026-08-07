import api from "./api";

export interface CreatePYQData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
}

export const getPYQs = async () => {
  const response = await api.get("/api/pyqs");
  return response.data.data;
};

export const createPYQ = async (data: CreatePYQData) => {
  const response = await api.post("/api/pyqs", data);
  return response.data.data;
};

export const deletePYQ = async (id: number) => {
  const response = await api.delete(`/api/pyqs/${id}`);
  return response.data;
};

export const updatePYQ = async (
  id: number,
  data: Partial<CreatePYQData>
) => {
  const response = await api.put(`/api/pyqs/${id}`, data);
  return response.data.data;
};