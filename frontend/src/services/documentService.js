import api from "./api";

export const uploadDocument = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return data;
};

export const getDocuments = async () => (await api.get("/api/documents/")).data;
export const getDocument = async (id) => (await api.get(`/api/documents/${id}`)).data;
export const deleteDocument = async (id) => api.delete(`/api/documents/${id}`);
export const getDocumentFileUrl = (id) =>
  `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/documents/${id}/file`;
