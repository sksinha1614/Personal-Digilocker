import Modal from "../ui/Modal";
import { getDocumentFileUrl } from "../../services/documentService";

export default function DocViewer({ doc, onClose }) {
  if (!doc) return null;
  return (
    <Modal isOpen={!!doc} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <iframe src={getDocumentFileUrl(doc.id)} className="h-[70vh] w-full rounded-lg bg-black/20" title="Document viewer" />
        <div className="space-y-2 text-sm">
          <h3 className="font-syne text-xl">Extracted Fields</h3>
          {["doc_type", "name", "dob", "id_number", "address", "gender", "expiry", "issuer"].map((k) => (
            <div key={k} className="rounded-lg bg-white/5 p-2">
              <span className="capitalize text-white/60">{k.replace("_", " ")}: </span>
              <span>{doc[k] || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
