export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`rounded-xl bg-indigoGlow px-4 py-2 font-semibold text-white transition hover:scale-[1.02] hover:bg-indigo-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
