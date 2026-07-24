import api from "./api";

export interface CreateNoteData {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
}

export const getNotes = async () => {
  const response = await api.get("/api/notes");

  console.log(response.data);

  return response.data.data;
};

export const createNote = async (data: CreateNoteData) => {
  const response = await api.post("/api/notes", data);
  return response.data;
};

export const deleteNote = async (id: number) => {
  const response = await api.delete(`/api/notes/${id}`);
  return response.data;
};