import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import useDocuments from "../hooks/useDocuments";
import DocGrid from "../components/documents/DocGrid";
import { useState } from "react";
import DocViewer from "../components/documents/DocViewer";

export default function Dashboard() {
  const { documents, remove } = useDocuments();
  const [selected, setSelected] = useState(null);

  const categories = new Set((documents || []).map((d) => (d.doc_type || "other").toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card>Total Docs: {documents.length}</Card>
        <Card>Categories: {categories.size}</Card>
        <Card>Last Upload: {documents[0] ? new Date(documents[0].created_at).toLocaleDateString() : "N/A"}</Card>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-syne text-2xl">Recent Documents</h3>
        <Link to="/upload">
          <Button>Quick Upload</Button>
        </Link>
      </div>
      <DocGrid docs={documents.slice(0, 5)} onView={setSelected} onDelete={remove} />
      <div className="grid gap-3 md:grid-cols-4">
        {["Identity", "Finance", "Education", "Medical"].map((c) => (
          <Card key={c}>{c}</Card>
        ))}
      </div>
      <DocViewer doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
