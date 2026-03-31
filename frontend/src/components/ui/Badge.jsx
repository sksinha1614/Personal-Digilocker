const map = {
  aadhaar: "bg-orange-500/20 text-orange-300 border-orange-400/50",
  pan: "bg-blue-500/20 text-blue-300 border-blue-400/50",
  marksheet: "bg-green-500/20 text-green-300 border-green-400/50",
  other: "bg-gray-500/20 text-gray-200 border-gray-400/50",
};

export default function Badge({ label = "Other" }) {
  const key = (label || "other").toLowerCase();
  const tone = map[key] || map.other;
  return <span className={`rounded-full border px-2 py-1 text-xs ${tone}`}>{label}</span>;
}
