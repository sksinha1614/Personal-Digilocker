export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="glass max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
