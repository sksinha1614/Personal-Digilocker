import DocCard from "./DocCard";

export default function DocGrid({ docs, onView, onDelete }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <DocCard key={doc.id} doc={doc} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  );
}
