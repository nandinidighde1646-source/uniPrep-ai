
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


export interface BulkUploadPYQResult {
  success: boolean;
  message: string;
  count: number;
}

export const bulkUploadPYQs = async (
  csv: File,
  pdfs: File[]
): Promise<BulkUploadPYQResult> => {
  const formData = new FormData();

  formData.append("csv", csv);

  pdfs.forEach((pdf) => {
    formData.append("pdfs", pdf);
  });

  const response = await api.post(
    "/api/pyqs/bulk-upload",
    formData
  );

  return response.data;
};
