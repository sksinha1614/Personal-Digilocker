import { Link } from "react-router-dom";
import {
  Upload,
  Scan,
  ShieldCheck,
  ArrowRight,
  Files,
} from "lucide-react";
import useDocuments from "../hooks/useDocuments";
import DocCard from "../components/documents/DocCard";
import DocViewer from "../components/documents/DocViewer";
import { useState } from "react";

export default function Dashboard() {
  const { documents, remove } = useDocuments();
  const [selected, setSelected] = useState(null);

  const totalSize = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);
  const usedPct = Math.min(
    100,
    Math.round((totalSize / (10 * 1024 * 1024 * 1024)) * 100)
  );

  const categorize = (d) => {
    const t = (d.doc_type || "").toLowerCase();
    if (["aadhaar", "passport", "voter", "driving"].some((x) => t.includes(x)))
      return "identity";
    if (["pan", "bank", "tax"].some((x) => t.includes(x))) return "finance";
    if (["marksheet", "certificate", "degree"].some((x) => t.includes(x)))
      return "education";
    if (["medical", "health", "insurance"].some((x) => t.includes(x)))
      return "medical";
    return "identity";
  };

  const categories = {
    identity: documents.filter((d) => categorize(d) === "identity"),
    finance: documents.filter((d) => categorize(d) === "finance"),
    education: documents.filter((d) => categorize(d) === "education"),
    medical: documents.filter((d) => categorize(d) === "medical"),
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      {/* ── Welcome ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-cream-500 text-sm mb-1">Welcome back,</p>
          <h1 className="font-display text-4xl md:text-5xl text-vault-800 leading-tight">
            Your Digital Vault
          </h1>
          <p className="text-cream-500 mt-2">
            Your vault is synchronized and secure.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] text-cream-500 uppercase tracking-widest mb-1">
              Storage
            </p>
            <p className="font-display text-3xl text-vault-800">
              {totalSizeMB}{" "}
              <span className="text-sm font-sans text-cream-500">MB</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-cream-500 uppercase tracking-widest mb-1">
              Used
            </p>
            <p className="font-display text-3xl text-vault-800">
              {usedPct}
              <span className="text-sm font-sans text-cream-500">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/upload"
          className="vault-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-vault-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-vault-800 text-sm">
              Upload New
            </h3>
            <p className="text-xs text-cream-500">Document</p>
          </div>
        </Link>

        <Link
          to="/upload"
          className="vault-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-vault-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-vault-800 text-sm">Scan ID</h3>
            <p className="text-xs text-cream-500">AI extraction</p>
          </div>
        </Link>

        <div className="vault-card p-5 flex items-center gap-4 group cursor-default">
          <div className="w-12 h-12 rounded-xl bg-vault-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-vault-800 text-sm">
              Vault Audit
            </h3>
            <p className="text-xs text-cream-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
              Active
            </p>
          </div>
        </div>
      </div>

      {/* ── Secure Categories ───────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-vault-800">
            Secure Categories
          </h2>
          <Link
            to="/documents"
            className="text-sm text-vault-500 hover:text-vault-700 flex items-center gap-1 transition-colors"
          >
            View All Categories <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured: Personal Identity */}
          <div className="bg-vault-800 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/15 px-2 py-0.5 rounded font-medium">
              Critical Assets
            </span>
            <h3 className="font-display text-2xl mt-4 mb-2">
              Personal Identity
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {categories.identity.length > 0
                ? `${categories.identity.length} document${
                    categories.identity.length > 1 ? "s" : ""
                  } protected in vault`
                : "Aadhaar, Passport, Voter ID and other identity documents"}
            </p>
            {categories.identity.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {categories.identity.slice(0, 3).map((d) => (
                  <span
                    key={d.id}
                    className="text-[11px] bg-white/10 px-2.5 py-1 rounded-lg text-white/70"
                  >
                    {d.doc_type || d.filename}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Financial Records */}
          <div className="vault-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cream-200/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="font-display text-xl text-vault-800 mb-2">
              Financial Records
            </h3>
            <p className="text-sm text-cream-500 leading-relaxed">
              {categories.finance.length > 0
                ? `${categories.finance.length} document${
                    categories.finance.length > 1 ? "s" : ""
                  } stored`
                : "Tax returns, PAN card, bank statements and portfolios"}
            </p>
            {categories.finance.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {categories.finance.slice(0, 3).map((d) => (
                  <span
                    key={d.id}
                    className="text-[11px] bg-cream-200 px-2.5 py-1 rounded-lg text-vault-700"
                  >
                    {d.doc_type || d.filename}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Recent Documents ────────────────────── */}
      {documents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-vault-800">
              Recent Documents
            </h2>
            <span className="text-sm text-cream-500 flex items-center gap-1.5">
              <Files size={14} />
              {documents.length} Files
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.slice(0, 6).map((doc) => (
              <DocCard
                key={doc.id}
                doc={doc}
                onView={setSelected}
                onDelete={remove}
              />
            ))}
          </div>
        </section>
      )}

      {documents.length === 0 && (
        <section className="vault-card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-4">
            <Files className="w-8 h-8 text-vault-400" />
          </div>
          <h3 className="font-display text-xl text-vault-800 mb-2">
            No documents yet
          </h3>
          <p className="text-cream-500 text-sm mb-5">
            Upload your first document to get started.
          </p>
          <Link to="/upload" className="vault-btn-primary">
            <Upload size={16} />
            Upload Document
          </Link>
        </section>
      )}

      <DocViewer doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
