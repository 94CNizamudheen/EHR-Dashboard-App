

import { useState } from "react";
import { API } from "@/lib/api"; 
import type { VitalSigns } from "@/types/types";

export default function VitalsSection({
  id,
  onSaved,
}: {
  id: string;
  onSaved: () => Promise<void>;
}) {
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [temp, setTemp] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const addVitals = async () => {
    if (!id) return;
    // optional basic validation: at least one value
    if (!bp && !hr && !temp && !weight) return;

    const payload: Partial<VitalSigns> = {
      bp: bp || undefined,
      hr: hr || undefined,
      temp: temp || undefined,
      weight: weight || undefined,
    };

    try {
      setSaving(true);
      await API.post(`/clinical/${id}/vitals`, payload);
      // clear inputs
      setBp(""); setHr(""); setTemp(""); setWeight("");
      await onSaved();
    } catch (err) {
      console.error("Error saving vitals", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Vitals</h2>
        <button
          onClick={addVitals}
          disabled={saving}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
        >
          Save
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input value={bp} onChange={(e)=>setBp(e.target.value)} placeholder="BP (e.g. 120/80)" className="border px-2 py-1 rounded" />
        <input value={hr} onChange={(e)=>setHr(e.target.value)} placeholder="HR (bpm)" className="border px-2 py-1 rounded" />
        <input value={temp} onChange={(e)=>setTemp(e.target.value)} placeholder="Temp (°C)" className="border px-2 py-1 rounded" />
        <input value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="Weight (kg)" className="border px-2 py-1 rounded" />
      </div>

      {/* Listing is handled by parent patient.notes/vitals render, so not repeated here */}
    </section>
  );
}
