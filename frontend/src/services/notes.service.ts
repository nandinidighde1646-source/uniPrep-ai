
import api from "./api";

export interface CreateNoteData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  pdf: File;
}

export const getNotes = async () => {
  const response = await api.get("/api/notes");
  return response.data.data;
};

export const createNote = async (data: CreateNoteData) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("subject", data.subject);
  formData.append("semester", String(data.semester));
  formData.append("branch", data.branch);
  formData.append("pdf", data.pdf);

  const response = await api.post("/api/notes", formData);
  return response.data;
};

export const deleteNote = async (id: number) => {
  const response = await api.delete(`/api/notes/${id}`);
  return response.data;
};


export interface UpdateNoteData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
}

export const updateNote = async (
  id: number,
  data: UpdateNoteData
) => {
  const response = await api.put(`/api/notes/${id}`, data);
  return response.data;
};
