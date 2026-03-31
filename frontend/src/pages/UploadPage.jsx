import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import DocUploader from "../components/documents/DocUploader";
import Card from "../components/ui/Card";
import useDocuments from "../hooks/useDocuments";

export default function UploadPage() {
  const { upload, uploadProgress } = useDocuments();
  const [result, setResult] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setFileType(file.type.includes("pdf") ? "PDF" : "Image");
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const data = await upload(file);
      setResult(data);
    } catch (e) {
      const message = axios.isAxiosError(e)
        ? e.response?.data?.detail || "Upload failed. Please try again."
        : "Upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const extractionPending =
    result &&
    !result.doc_type &&
    !result.name &&
    !result.dob &&
    !result.id_number &&
    !result.address &&
    !result.gender &&
    !result.expiry &&
    !result.issuer;

  return (
    <div className="space-y-4">
      <DocUploader onFile={handleUpload} />
      {fileType && <p className="text-sm text-white/80">Detected file type: {fileType}</p>}
      {uploading && (
        <div className="h-3 w-full rounded-full bg-white/10">
          <div className="h-3 rounded-full bg-cyanGlow transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}
      {error && <Card className="border border-red-400/40 bg-red-500/10 text-red-100">{error}</Card>}
      {result && (
        <Card>
          <h3 className="mb-3 font-syne text-xl">Extracted Fields</h3>
          {extractionPending && (
            <div className="mb-3 rounded-lg border border-amber-300/30 bg-amber-500/10 p-3 text-sm text-amber-100">
              The file uploaded successfully, but we could not extract the document details yet. Try a clearer image,
              a smaller file, or the original PDF if you have it.
            </div>
          )}
          <div className="grid gap-2 md:grid-cols-2">
            {["doc_type", "name", "dob", "id_number", "address", "gender", "expiry", "issuer"].map((k) => (
              <div key={k} className="flex items-center gap-2 rounded-lg bg-green-500/10 p-2">
                <CheckCircle2 size={16} className="text-green-300" />
                <span className="capitalize text-white/80">{k.replace("_", " ")}:</span>
                <span>{result[k] || "N/A"}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
