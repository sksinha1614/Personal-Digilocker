import { X, CheckCircle2, FileText } from "lucide-react";
import Modal from "../ui/Modal";
import { getDocumentFileUrl } from "../../services/documentService";

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

export default function DocViewer({ doc, onClose }) {
  if (!doc) return null;
  return (
    <Modal isOpen={!!doc} onClose={onClose}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-vault-800 mb-4">
            Document Preview
          </h3>
          <iframe
            src={getDocumentFileUrl(doc.id)}
            className="h-[65vh] w-full rounded-xl bg-cream-100 border border-cream-300"
            title="Document viewer"
          />
        </div>
        <div>
          <h3 className="font-display text-xl text-vault-800 mb-4">
            Extracted Fields
          </h3>
          <div className="space-y-2.5">
            {Object.entries(fieldLabels).map(([key, label]) => (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-xl p-3 border ${
                  doc[key]
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-cream-50 border-cream-300"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    doc[key] ? "bg-emerald-100" : "bg-cream-200"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      doc[key] ? "text-emerald-600" : "text-cream-400"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-cream-500 uppercase tracking-wider">
                    {label}
                  </p>
                  <p
                    className={`text-sm font-medium truncate ${
                      doc[key] ? "text-vault-800" : "text-cream-400"
                    }`}
                  >
                    {doc[key] || "Not detected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
