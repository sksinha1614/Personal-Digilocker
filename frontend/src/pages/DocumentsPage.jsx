import { useMemo, useState } from "react";
import { Files } from "lucide-react";
import DocGrid from "../components/documents/DocGrid";
import DocViewer from "../components/documents/DocViewer";
import useDocuments from "../hooks/useDocuments";

const tabs = ["all", "identity", "finance", "education", "medical"];

const mapType = (docType = "") => {
  const t = docType.toLowerCase();
  if (["aadhaar", "passport", "voter", "driving"].some((x) => t.includes(x)))
    return "identity";
  if (["pan", "bank", "tax"].some((x) => t.includes(x))) return "finance";
  if (["marksheet", "certificate", "degree"].some((x) => t.includes(x)))
    return "education";
  if (["medical", "health", "insurance"].some((x) => t.includes(x)))
    return "medical";
  return "identity";
};

export default function DocumentsPage() {
  const { documents, remove } = useDocuments();
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(
    () =>
      tab === "all"
        ? documents
        : documents.filter((d) => mapType(d.doc_type) === tab),
    [documents, tab]
  );

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div>
        <h1 className="font-display text-3xl text-vault-800 mb-1">
          Documents
        </h1>
        <p className="text-cream-500 text-sm">
          Browse and manage all your stored documents
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
              tab === t
                ? "bg-vault-800 text-white"
                : "bg-white border border-cream-300 text-cream-600 hover:bg-cream-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <DocGrid docs={filtered} onView={setSelected} onDelete={remove} />
      ) : (
        <div className="vault-card p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-3">
            <Files className="w-7 h-7 text-vault-400" />
          </div>
          <p className="text-cream-500 text-sm">
            No documents found in this category.
          </p>
        </div>
      )}

      <DocViewer doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
