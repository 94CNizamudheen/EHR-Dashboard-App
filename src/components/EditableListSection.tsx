import { useState } from "react";

export default function EditableListSection({
  title,
  items,
  setItems,
  onSave,
}: {
  title: string;
  items: string[];
  setItems: (items: string[]) => void;
  onSave: () => Promise<void>;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (): void => {
    const v = input.trim();
    if (!v) {
      setError("Field cannot be empty");
      return;
    }
    if (items.includes(v)) {
      setError(`${title.slice(0, -1)} already exists`);
      return;
    }
    setItems([...items, v]);
    setInput("");
    setError(null);
  };

  const handleRemove = (idx: number): void => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <section className="bg-[var(--hospital-surface)] p-5 rounded-xl shadow-lg border border-[var(--hospital-border)] mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">{title}</h2>
        <button
          onClick={onSave}
          className="px-4 py-1 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
        >
          save
        </button>
      </div>

      {/* List */}
      <ul className="text-sm space-y-1">
        {items.length > 0 ? (
          items.map((m, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b border-[var(--hospital-border)] py-1"
            >
              <span>{m}</span>
              <button
                onClick={() => handleRemove(i)}
                className="text-red-500 text-xs px-2 py-0.5 rounded-full hover:bg-red-500/10"
              >
                ✕
              </button>
            </li>
          ))
        ) : (
          <li className="text-[var(--hospital-subtle)]">No records</li>
        )}
      </ul>

      {/* Input + Add */}
      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={`Add ${title.toLowerCase()}...`}
          className="input flex-1"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </section>
  );
}
