"use client";

import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { BillingCode, Patient } from "@/types/types";

export default function NewPaymentPage() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [codes, setCodes] = useState<BillingCode[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [manualAmount, setManualAmount] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const res = await API.get<BillingCode[]>("/billing/codes");
      setCodes(res.data);
    } catch (err) {
      console.error("Error loading codes", err);
      setCodes([]);
    }
  };

  const searchPatients = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await API.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
      setPatients(res.data);
      setSelectedPatient(null);
    } catch (err) {
      console.error("Search failed", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCharge = async () => {
    setError(null);
    if (!selectedPatient) return setError("Select a patient first");
    if (!selectedCode && (manualAmount === "" || Number(manualAmount) <= 0)) {
      return setError("Choose a billing code or enter an amount");
    }

    try {
      setLoading(true);

      const payload: Record<string, unknown> = {};
      if (selectedCode) payload.code = selectedCode;
      if (manualAmount !== "" && Number(manualAmount) > 0) {
        payload.amount = Number(manualAmount);
      }

      const res = await API.post<{ charge: { code: string; amount: number } }>(
        `/billing/${selectedPatient._id}/charge`,
        payload
      );

      setMessage(`✅ Charge added: ${res.data.charge.code} (${res.data.charge.amount})`);
      setSelectedCode("");
      setManualAmount("");
    } catch (err) {
      console.error("Error adding charge", err);
      setError("Failed to add charge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--hospital-text)]">
        Record New Payment
      </h1>

      {/* Search section */}
      <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg">
        <h2 className="font-medium mb-3">Search Patient</h2>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or phone"
            className="input flex-1"
          />
          <button
            onClick={searchPatients}
            disabled={loading}
            className="input-action bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] rounded-2xl p-2"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Multiple results */}
        {patients.length > 0 && !selectedPatient && (
          <ul className="mt-3 border border-[var(--hospital-border)] rounded divide-y divide-[var(--hospital-border)] text-sm">
            {patients.map((p) => (
              <li
                key={p._id}
                className="px-3 py-2 flex justify-between items-center hover:bg-[var(--hospital-muted)] transition"
              >
                <span>
                  {p.firstName} {p.lastName} — {p.contact?.phone ?? "—"}
                </span>
                <button
                  onClick={() => setSelectedPatient(p)}
                  className="input-action bg-gradient-to-r from-[var(--hospital-accent)] to-amber-400 text-[var(--hospital-bg)] text-xs px-3 rounded-2xl "
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payment form */}
      {selectedPatient && (
        <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">
              Add Charge for {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <button
              onClick={() => setSelectedPatient(null)}
              className="input-action bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-2xl"
            >
              Deselect
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--hospital-subtle)] mb-1">
                Billing code (optional)
              </label>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="input w-full"
              >
                <option value="">— choose code —</option>
                {codes.map((c) => (
                  <option key={c._id} value={c.code}>
                    {c.code} — {c.description} ({c.amount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--hospital-subtle)] mb-1">
                Manual amount (optional)
              </label>
              <input
                value={manualAmount}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (v === "") setManualAmount("");
                  else {
                    const num = parseFloat(v);
                    setManualAmount(Number.isNaN(num) ? "" : num);
                  }
                }}
                placeholder="e.g. 200.00"
                className="input w-full"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && (
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleAddCharge}
              disabled={loading}
              className="input-action bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl px-2"
            >
              {loading ? "Processing..." : "Add Charge"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
