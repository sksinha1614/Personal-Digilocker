import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, FileCheck, Scan } from "lucide-react";
import { motion } from "framer-motion";

export default function DocUploader({ onFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && onFile(files[0]),
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className="relative cursor-pointer group"
    >
      <div
        className={`vault-card p-10 text-center transition-all duration-300 border-2 border-dashed ${
          isDragActive
            ? "border-vault-400 bg-vault-50 shadow-cardHover"
            : "border-cream-400 hover:border-vault-300 hover:bg-cream-50"
        }`}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div className="relative inline-block mb-4">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragActive
                ? "bg-vault-800"
                : "bg-cream-200 group-hover:bg-vault-100"
            }`}
          >
            {isDragActive ? (
              <Scan className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Upload className="w-10 h-10 text-vault-500 group-hover:scale-110 transition-transform" />
            )}
          </div>
          {isDragActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <FileCheck className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>

        {/* Text */}
        <h3
          className={`font-display text-xl mb-2 transition-colors ${
            isDragActive ? "text-vault-800" : "text-vault-700"
          }`}
        >
          {isDragActive ? "Drop to Upload" : "Upload Your Document"}
        </h3>
        <p className="text-cream-500 text-sm mb-5">
          {isDragActive
            ? "Release to start AI processing..."
            : "Drag and drop or click to browse"}
        </p>

        {/* Formats */}
        <div className="flex items-center justify-center gap-3">
          {[
            { icon: FileText, label: "PDF" },
            { icon: Image, label: "PNG" },
            { icon: Image, label: "JPG" },
          ].map((format) => (
            <div
              key={format.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 border border-cream-300 text-xs text-cream-600"
            >
              <format.icon className="w-3 h-3" />
              {format.label}
            </div>
          ))}
        </div>

        {/* AI badge */}
        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vault-50 border border-vault-200">
          <span className="w-2 h-2 rounded-full bg-vault-400 animate-pulse-soft" />
          <span className="text-xs text-vault-600 font-medium">
            AI-Powered Extraction
          </span>
        </div>
      </div>
    </motion.div>
  );
}
