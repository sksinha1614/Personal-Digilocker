import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import DocUploader from "../components/documents/DocUploader";
import useDocuments from "../hooks/useDocuments";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = {
  "Identity Proof": ["Aadhaar Card", "PAN Card", "Passport"],
  "Education": ["10th / 12th Marksheet", "Degree Certificates"],
  "Financial": ["Bank Passbook", "ITR"],
  "Health": ["Vaccination Certificate", "Medical Reports"],
  "Others": ["Driving License", "Utility Bills"],
};

const fieldLabels = {
  doc_type: "Document Type",
  name: "Full Name",
  dob: "Date of Birth",
  id_number: "ID Number",
  address: "Address",
  gender: "Gender",
  expiry: "Expiry Date",
  issuer: "Issuing Authority",
};

export default function UploadPage() {
  const { upload, uploadProgress } = useDocuments();
  const [result, setResult] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [pendingFile, setPendingFile] = useState(null);

  const subCategories = category ? [...(CATEGORIES[category] || []), "Other"] : [];

  const handleFileSelect = (file) => {
    setPendingFile(file);
    setFileType(file.type.includes("pdf") ? "PDF" : "Image");
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    if (!category || (!subCategory && subCategory !== "Other") || (subCategory === "Other" && !customSubCategory.trim())) {
      setError("Please select a category and specify the document type before uploading.");
      return;
    }
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const finalType = subCategory === "Other" ? customSubCategory.trim() : subCategory;
      const data = await upload(pendingFile, category, finalType);
      setResult(data);
      setPendingFile(null);
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
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vault-50 border border-vault-200 mb-4">
          <Sparkles className="w-4 h-4 text-vault-500" />
          <span className="text-sm text-vault-600 font-medium">
            AI-Powered Document Processing
          </span>
        </div>
        <h1 className="font-display text-3xl text-vault-800 mb-2">
          Upload Document
        </h1>
        <p className="text-cream-500 text-sm">
          Select a category, then upload your document for AI extraction
        </p>
      </div>

      {/* Category Selection */}
      <div className="vault-card p-5">
        <h3 className="font-semibold text-vault-800 text-sm mb-4">
          Document Classification
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label className="text-[10px] text-cream-500 uppercase tracking-wider mb-1.5 block">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory("");
                }}
                className="vault-input appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select category...</option>
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500 pointer-events-none" />
            </div>
          </div>

          {/* Sub-category */}
          <div>
            <label className="text-[10px] text-cream-500 uppercase tracking-wider mb-1.5 block">
              Document Type
            </label>
            <div className="relative">
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={!category}
                className="vault-input appearance-none pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {category ? "Select type..." : "Select category first"}
                </option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500 pointer-events-none" />
            </div>
          </div>
          
          {subCategory === "Other" && (
            <div className="sm:col-span-2">
              <label className="text-[10px] text-cream-500 uppercase tracking-wider mb-1.5 block">
                Specify Document Type
              </label>
              <input
                type="text"
                value={customSubCategory}
                onChange={(e) => setCustomSubCategory(e.target.value)}
                placeholder="E.g., Rent Agreement, Vehicle RC"
                className="vault-input w-full"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Uploader */}
      <DocUploader onFile={handleFileSelect} />

      {/* File selected indicator */}
      <AnimatePresence>
        {pendingFile && !uploading && !result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="vault-card p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-vault-500" />
              <div>
                <p className="text-sm font-medium text-vault-800 truncate max-w-[200px]">
                  {pendingFile.name}
                </p>
                <p className="text-[11px] text-cream-500">
                  {fileType} &middot;{" "}
                  {(pendingFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={!category || !subCategory}
              className="vault-btn-primary disabled:opacity-50"
            >
              Upload & Extract
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="vault-card p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-vault-500 animate-spin" />
            <span className="text-sm text-vault-700">
              Uploading and processing with AI...
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-vault-500"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="vault-card border-red-200 bg-red-50 p-5 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium text-sm">Error</p>
            <p className="text-red-600/70 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="vault-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display text-xl text-vault-800">
                Extraction Complete
              </h3>
              <p className="text-cream-500 text-sm">
                AI has analyzed your document
              </p>
            </div>
          </div>

          {extractionPending && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                The file uploaded successfully, but we could not extract the
                document details yet. Try a clearer image, a smaller file, or
                the original PDF if you have it.
              </p>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(fieldLabels).map(([key, label]) => (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-xl p-3 border ${
                  result[key]
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-cream-50 border-cream-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    result[key] ? "bg-emerald-100" : "bg-cream-200"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      result[key] ? "text-emerald-600" : "text-cream-400"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-cream-500 uppercase tracking-wider">
                    {label}
                  </p>
                  <p
                    className={`text-sm font-medium truncate ${
                      result[key] ? "text-vault-800" : "text-cream-400"
                    }`}
                  >
                    {result[key] || "Not detected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
