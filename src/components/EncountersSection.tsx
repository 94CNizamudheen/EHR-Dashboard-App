import { useState } from "react";
import { API } from "@/lib/api";

export default function EncountersSection({
  id,
  onSaved,
}: {
  id: string;
  onSaved: () => Promise<void>;
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [procedure, setProcedure] = useState("");
  const [notes, setNotes] = useState("");
  const [provider, setProvider] = useState("");
  const [saving, setSaving] = useState(false);

  const addEncounter = async () => {
    if (!id) return;
    if (!diagnosis.trim() && !procedure.trim() && !notes.trim()) return;

    try {
      setSaving(true);
      await API.post(`/clinical/${id}/encounters`, {
        diagnosis: diagnosis || undefined,
        procedure: procedure || undefined,
        notes: notes || undefined,
        provider: provider || undefined,
      });
      setDiagnosis("");
      setProcedure("");
      setNotes("");
      setProvider("");
      await onSaved();
    } catch (err) {
      console.error("Error adding encounter", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-[var(--hospital-surface)] p-5 rounded-xl shadow-lg border border-[var(--hospital-border)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--hospital-text)]">
          Encounters
        </h2>
        <button
          onClick={addEncounter}
          disabled={saving}
          className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="Provider"
          className="input"
        />
        <input
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Diagnosis"
          className="input"
        />
        <input
          value={procedure}
          onChange={(e) => setProcedure(e.target.value)}
          placeholder="Procedure"
          className="input md:col-span-2"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="input col-span-1 md:col-span-2"
        />
      </div>
    </section>
  );
}
