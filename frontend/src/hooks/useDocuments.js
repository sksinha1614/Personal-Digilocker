import { useEffect, useState } from "react";
import { deleteDocument, getDocuments, uploadDocument } from "../services/documentService";
import { useStore } from "../store/useStore";

export default function useDocuments() {
  const { documents, setDocuments } = useStore();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } finally {
      setLoading(false);
    }
  };

  const upload = async (file) => {
    setUploadProgress(0);
    const data = await uploadDocument(file, (e) => {
      if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
    });
    await refresh();
    return data;
  };

  const remove = async (id) => {
    await deleteDocument(id);
    await refresh();
  };

  useEffect(() => {
    refresh();
  }, []);

  return { documents, loading, uploadProgress, refresh, upload, remove };
}
