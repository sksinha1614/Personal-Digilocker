import { useDropzone } from "react-dropzone";
import Card from "../ui/Card";

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
    <div {...getRootProps()}>
      <Card
        className={`cursor-pointer border-2 border-dashed p-10 text-center transition ${isDragActive ? "border-cyanGlow" : "border-white/30"}`}
      >
        <input {...getInputProps()} />
        <p className="text-lg">Drag and drop PDF/Image here</p>
        <p className="text-sm text-white/70">or click to browse files</p>
      </Card>
    </div>
  );
}
