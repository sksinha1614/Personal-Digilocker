import { useMemo, useState } from "react";
import DocGrid from "../components/documents/DocGrid";
import DocViewer from "../components/documents/DocViewer";
import useDocuments from "../hooks/useDocuments";

const tabs = ["all", "identity", "finance", "education", "medical"];
const mapType = (docType = "") => {
  const t = docType.toLowerCase();
  if (["aadhaar", "passport", "voter", "driving"].some((x) => t.includes(x))) return "identity";
  if (["pan", "bank", "tax"].some((x) => t.includes(x))) return "finance";
  if (["marksheet", "certificate", "degree"].some((x) => t.includes(x))) return "education";
  if (["medical", "health", "insurance"].some((x) => t.includes(x))) return "medical";
  return "identity";
};

export default function DocumentsPage() {
  const { documents, remove } = useDocuments();
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(
    () => (tab === "all" ? documents : documents.filter((d) => mapType(d.doc_type) === tab)),
    [documents, tab]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1 text-sm ${tab === t ? "bg-indigoGlow" : "bg-white/10"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <DocGrid docs={filtered} onView={setSelected} onDelete={remove} />
      <DocViewer doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
