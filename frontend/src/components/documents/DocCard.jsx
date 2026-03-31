import { Eye, Trash2, FileText } from "lucide-react";
import Badge from "../ui/Badge";

export default function DocCard({ doc, onView, onDelete }) {
  return (
    <div className="vault-card p-5 space-y-3 group">
      <div className="flex items-center justify-between">
        <Badge label={doc.doc_type || "Other"} />
        <p className="text-[11px] text-cream-500">
          {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-vault-500" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-vault-800 text-sm truncate">
            {doc.name || doc.filename}
          </h4>
          <p className="text-xs text-cream-500 truncate">
            {doc.id_number || "ID unavailable"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onView(doc)}
          className="vault-btn-outline py-1.5 px-3 text-xs"
        >
          <Eye size={13} /> View
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          className="vault-btn-danger py-1.5 px-3 text-xs"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
