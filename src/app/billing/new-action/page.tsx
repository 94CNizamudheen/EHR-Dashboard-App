"use client";

import {  useState } from "react";
import { API } from "@/lib/api";
import { BillingAccount, Patient, PaymentMethod } from "@/types/types";


export default function NewActionPaymentPage() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [account, setAccount] = useState<BillingAccount | null>(null);

  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<"cash" | "card" | "insurance" | "other">("cash");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const searchPatients = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await API.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
      setPatients(res.data);
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
    } catch (err) {
      console.error("Could not fetch account", err);
      setAccount(null);
    }
  };

  const handlePayment = async () => {
    if (!selectedPatient) return alert("Select a patient first");
    if (amount === "" || Number(amount) <= 0) return alert("Enter a valid amount");

    try {
      setLoading(true);
      await API.post(`/billing/${selectedPatient._id}/payment`, {
        amount: Number(amount),
        method,
        note: note.trim() || undefined,
      });

      setMessage("Payment recorded successfully");
      setAmount("");
      setNote("");
      await fetchAccount(selectedPatient._id);
    } catch (err) {
      console.error("Error recording payment", err);
      alert("Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Pay / Action Payment</h1>

      {/* search */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-medium mb-2">Search Patient</h2>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or phone"
            className="border px-3 py-2 rounded flex-1"
          />
          <button
            onClick={searchPatients}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </div>

        {patients.length > 0 && (
          <ul className="mt-3 border rounded divide-y text-sm">
            {patients.map((p) => (
              <li
                key={p._id}
                onClick={() => {
                  setSelectedPatient(p);
                  fetchAccount(p._id);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                  selectedPatient?._id === p._id ? "bg-blue-100" : ""
                }`}
              >
                {p.firstName} {p.lastName} — {p.contact?.phone ?? "—"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* payment section */}
      {selectedPatient && account && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-medium mb-2">
            Record Payment for {selectedPatient.firstName} {selectedPatient.lastName}
          </h2>

          <p className="text-sm text-gray-600 mb-3">
            Current Balance: <span className="font-semibold">{account.balance.toFixed(2)}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
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
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm text-gray-600 mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              rows={2}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* past payments */}
      {account && account.payments.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-medium mb-2">Past Payments</h2>
          <ul className="text-sm divide-y">
            {account.payments.slice().reverse().map((p, i) => (
              <li key={i} className="py-1 flex justify-between">
                <span>
                  {p.date.slice(0, 10)} — {p.method} {p.note ? `(${p.note})` : ""}
                </span>
                <span>{p.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <div className="mt-3 px-3 py-2 bg-green-100 text-green-800 rounded">{message}</div>}
    </div>
  );
}
