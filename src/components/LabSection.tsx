

import { useState } from "react";
import { API } from "@/lib/api"; 


export default  function LabsSection({ id, onSaved }: { id: string; onSaved: () => Promise<void> }) {
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
      setTestName(""); setResult(""); setUnit(""); setNormalRange(""); setNotes("");
      await onSaved();
    } catch (err) {
      console.error("Error saving lab", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Lab Results</h2>
        <button onClick={addLab} disabled={saving} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
          Save
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input value={testName} onChange={(e)=>setTestName(e.target.value)} placeholder="Test name" className="border px-2 py-1 rounded" />
        <input value={result} onChange={(e)=>setResult(e.target.value)} placeholder="Result" className="border px-2 py-1 rounded" />
        <input value={unit} onChange={(e)=>setUnit(e.target.value)} placeholder="Unit" className="border px-2 py-1 rounded" />
        <input value={normalRange} onChange={(e)=>setNormalRange(e.target.value)} placeholder="Normal range" className="border px-2 py-1 rounded" />
        <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes (optional)" className="col-span-2 border px-2 py-1 rounded" />
      </div>
    </section>
  );
}
