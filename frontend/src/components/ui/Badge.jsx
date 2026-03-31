const map = {
  aadhaar: "bg-amber-50 text-amber-700 border-amber-200",
  pan: "bg-sky-50 text-sky-700 border-sky-200",
  passport: "bg-emerald-50 text-emerald-700 border-emerald-200",
  marksheet: "bg-violet-50 text-violet-700 border-violet-200",
  other: "bg-cream-200 text-vault-600 border-cream-400",
};

export default function Badge({ label = "Other" }) {
  const key = (label || "other").toLowerCase();
  const tone = map[key] || map.other;
  return (
    <span className={`vault-badge ${tone}`}>{label}</span>
  );
}
