"use client";

import { useState } from "react";
import { API } from "@/lib/api";
import { BillingAccount, Patient, PaymentMethod } from "@/types/types";

export default function NewActionPaymentPage() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [account, setAccount] = useState<BillingAccount | null>(null);

  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchPatients = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await API.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
      setPatients(res.data);
      setSelectedPatient(null);
      setAccount(null);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccount = async (id: string) => {
    try {
      const res = await API.get<BillingAccount>(`/billing/account/${id}`);
      setAccount(res.data);
    } catch {
      setAccount(null);
    }
  };

  const handlePayment = async () => {
    setError(null);
    if (!selectedPatient) return setError("Select a patient first");
    if (amount === "" || Number(amount) <= 0) return setError("Enter a valid positive amount");

    try {
      setLoading(true);
      await API.post(`/billing/${selectedPatient._id}/payment`, {
        amount: Number(amount),
        method,
        note: note.trim() || undefined,
      });

      setMessage("✅ Payment recorded successfully");
      setError(null);
      setAmount("");
      setNote("");
      await fetchAccount(selectedPatient._id);
    } catch (err) {
      console.error("Error recording payment", err);
      setError("Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--hospital-text)]">
        Pay / Action Payment
      </h1>

      {/* search */}
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

        {/* multiple results */}
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
                  onClick={() => {
                    setSelectedPatient(p);
                    fetchAccount(p._id);
                  }}
                  className="input-action  bg-gradient-to-r from-[var(--hospital-accent)] to-amber-400 text-[var(--hospital-bg)] text-xs px-3 py-1 border rounded-2xl "
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* payment section */}
      {selectedPatient && account && (
        <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">
              Record Payment for {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <button
              onClick={() => {
                setSelectedPatient(null);
                setAccount(null);
              }}
              className="input-action bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-2xl p-2"
            >
              Deselect
            </button>
          </div>

          <p className="text-sm text-[var(--hospital-subtle)]">
            Current Balance:{" "}
            <span className="font-semibold text-[var(--hospital-text)]">
              {account.balance.toFixed(2)}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--hospital-subtle)] mb-1">Amount</label>
              <input
                value={amount}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (v === "") setAmount("");
                  else {
                    const num = parseFloat(v);
                    setAmount(Number.isNaN(num) ? "" : num);
                  }
                }}
                placeholder="e.g. 500.00"
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--hospital-subtle)] mb-1">Method</label>
              <div className="select-wrapper">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="input w-full"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--hospital-subtle)] mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input w-full"
              rows={2}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && (
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="input-action bg-gradient-to-r from-[var(--hospital-accent)] rounded-2xl p-2 to-amber-400 text-[var(--hospital-bg)]"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      )}

      {/* past payments */}
      {account && account.payments.length > 0 && (
        <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg">
          <h2 className="font-medium mb-3">Past Payments</h2>
          <ul className="text-sm divide-y divide-[var(--hospital-border)]">
            {account.payments
              .slice()
              .reverse()
              .map((p, i) => (
                <li
                  key={i}
                  className={`py-2 flex justify-between ${
                    i % 2 === 0 ? "bg-[var(--hospital-muted)]/50" : ""
                  } px-2 rounded`}
                >
                  <span>
                    {p.date.slice(0, 10)} — {p.method}{" "}
                    {p.note ? `(${p.note})` : ""}
                  </span>
                  <span className="font-medium">{p.amount.toFixed(2)}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
