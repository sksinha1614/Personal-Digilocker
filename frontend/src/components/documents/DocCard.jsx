import { Eye, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

export default function DocCard({ doc, onView, onDelete }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge label={doc.doc_type || "Other"} />
        <p className="text-xs text-white/60">{new Date(doc.created_at).toLocaleDateString()}</p>
      </div>
      <div>
        <h4 className="font-semibold">{doc.name || doc.filename}</h4>
        <p className="text-sm text-white/70">{doc.id_number || "ID unavailable"}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onView(doc)} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-sm">
          <Eye size={14} /> View
        </button>
        <button onClick={() => onDelete(doc.id)} className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1 text-sm text-red-200">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </Card>
  );
}
