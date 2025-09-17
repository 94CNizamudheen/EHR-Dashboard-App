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
      setBp("");
      setHr("");
      setTemp("");
      setWeight("");
      await onSaved();
    } catch (err) {
      console.error("Error saving vitals", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-[var(--hospital-surface)] p-5 rounded-xl shadow-lg border border-[var(--hospital-border)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--hospital-text)]">
          Vitals
        </h2>
        <button
          onClick={addVitals}
          disabled={saving}
          className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          value={bp}
          onChange={(e) => setBp(e.target.value)}
          placeholder="BP (120/80)"
          className="input"
        />
        <input
          value={hr}
          onChange={(e) => setHr(e.target.value)}
          placeholder="HR (bpm)"
          className="input"
        />
        <input
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          placeholder="Temp (°C)"
          className="input"
        />
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          className="input"
        />
      </div>
    </section>
  );
}
