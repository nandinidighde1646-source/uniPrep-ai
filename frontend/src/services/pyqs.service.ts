
import api from "./api";

export interface CreatePYQData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  year: number;
  pdf: File;
}

export interface UpdatePYQData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  year: number;
  fileUrl: string;
}

export const getPYQs = async () => {
  const response = await api.get("/api/pyqs");
  return response.data.data;
};

export const createPYQ = async (data: CreatePYQData) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("subject", data.subject);
  formData.append("semester", String(data.semester));
  formData.append("branch", data.branch);
  formData.append("year", String(data.year));
  formData.append("pdf", data.pdf);

  const response = await api.post("/api/pyqs", formData);
  return response.data.data;
};

export const deletePYQ = async (id: number) => {
  const response = await api.delete(`/api/pyqs/${id}`);
  return response.data;
};

export const updatePYQ = async (
  id: number,
  data: Partial<UpdatePYQData>
) => {
  const response = await api.put(`/api/pyqs/${id}`, data);
  return response.data.data;
};
