
import { useState } from "react";
import { API } from "@/lib/api"; 

export default function EncountersSection({ id, onSaved }: { id: string; onSaved: () => Promise<void> }) {
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
      setDiagnosis(""); setProcedure(""); setNotes(""); setProvider("");
      await onSaved();
    } catch (err) {
      console.error("Error adding encounter", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Encounters</h2>
        <button onClick={addEncounter} disabled={saving} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
          Save
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input value={provider} onChange={(e)=>setProvider(e.target.value)} placeholder="Provider" className="border px-2 py-1 rounded" />
        <input value={diagnosis} onChange={(e)=>setDiagnosis(e.target.value)} placeholder="Diagnosis" className="border px-2 py-1 rounded" />
        <input value={procedure} onChange={(e)=>setProcedure(e.target.value)} placeholder="Procedure" className="border px-2 py-1 rounded" />
        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="col-span-2 border px-2 py-1 rounded" />
      </div>
    </section>
  );
}
