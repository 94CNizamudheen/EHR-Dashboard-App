import { useState } from "react";
import { API } from "@/lib/api";

export default function LabsSection({
  id,
  onSaved,
}: {
  id: string;
  onSaved: () => Promise<void>;
}) {
  const [testName, setTestName] = useState("");
  const [result, setResult] = useState("");
  const [unit, setUnit] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const addLab = async () => {
    if (!id) return;
    if (!testName.trim() || !result.trim()) return;

    try {
      setSaving(true);
      await API.post(`/clinical/${id}/labs`, {
        testName,
        result,
        unit: unit || undefined,
        normalRange: normalRange || undefined,
        notes: notes || undefined,
      });
      setTestName("");
      setResult("");
      setUnit("");
      setNormalRange("");
      setNotes("");
      await onSaved();
    } catch (err) {
      console.error("Error saving lab", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-[var(--hospital-surface)] p-5 rounded-xl shadow-lg border border-[var(--hospital-border)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--hospital-text)]">
          Lab Results
        </h2>
        <button
          onClick={addLab}
          disabled={saving}
          className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        <input
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Test name"
          className="input"
        />
        <input
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Result"
          className="input"
        />
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit"
          className="input"
        />
        <input
          value={normalRange}
          onChange={(e) => setNormalRange(e.target.value)}
          placeholder="Normal range"
          className="input"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="input col-span-2"
        />
      </div>
    </section>
  );
}
