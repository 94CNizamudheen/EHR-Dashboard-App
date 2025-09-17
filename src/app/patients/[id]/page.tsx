"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "../../../lib/api";
import type { BillingAccount, History, Patient } from "@/types/types";

export default function PatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  // data
  const [patient, setPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<History>({ payments: [], appointments: [] });
  const [billing, setBilling] = useState<BillingAccount | null>(null);

  const [view, setView] = useState<"medical" | "history">("medical");
  const [editing, setEditing] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const [payAmount, setPayAmount] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("cash");
  const [payNote, setPayNote] = useState<string>("");
  const [creatingPayment, setCreatingPayment] = useState(false);

  useEffect(() => {
    if (!id) return;
    void fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!id) return;
    void fetchBillingAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (view === "history" && id) {
      void fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, id]);

  async function fetchPatient(): Promise<void> {
    if (!id) return;
    setLoadingPatient(true);
    setErrorMessage(null);
    try {
      const res = await API.get<Patient>(`/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      console.error("fetchPatient error", err);
      setErrorMessage("Unable to load patient");
    } finally {
      setLoadingPatient(false);
    }
  }

  async function fetchHistory(): Promise<void> {
    if (!id) return;
    setLoadingHistory(true);
    try {
      const res = await API.get<History>(`/patients/history/${id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("fetchHistory error", err);
      // show nothing but keep console log
    } finally {
      setLoadingHistory(false);
    }
  }

  async function fetchBillingAccount(): Promise<void> {
    if (!id) return;
    try {
      const res = await API.get<BillingAccount>(`/billing/account/${id}`);
      setBilling(res.data);
    } catch (err) {
      console.log(err)
      setBilling(null);
    }
  }

  function handleChange(field: keyof Patient, value: string) {
    if (!patient) return;
    setPatient({ ...patient, [field]: value } as Patient);
  }

  function handleContactChange(field: keyof Patient["contact"], value: string) {
    if (!patient) return;
    setPatient({ ...patient, contact: { ...patient.contact, [field]: value } } as Patient);
  }

  async function handleUpdate(): Promise<void> {
    if (!patient || !id) return;
    if (!patient.firstName.trim() || !patient.lastName.trim() || !patient.contact.phone.trim()) {
      setErrorMessage("First name, last name and phone are required.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await API.put<Patient>(`/patients/${id}`, patient);
      setPatient(res.data);
      setEditing(false);
      showSaved("Patient updated");
    } catch (err) {
      console.error("update patient error", err);
      setErrorMessage("Failed to update patient");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!id) return;
    if (!confirm("Delete this patient? This action cannot be undone.")) return;
    try {
      await API.delete(`/patients/${id}`);
      router.push("/patients");
    } catch (err) {
      console.error("delete error", err);
      alert("Unable to delete patient");
    }
  }

  function showSaved(msg: string) {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 2500);
  }

  async function handleCreatePayment(): Promise<void> {
    if (!id) return;
    const amountNum = Number(payAmount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    setCreatingPayment(true);
    try {
      const payload = { amount: amountNum, method: payMethod, note: payNote };
      await API.post(`/billing/${id}/payment`, payload);
      await Promise.all([fetchBillingAccount(), fetchHistory()]);
      setPayAmount("");
      setPayMethod("cash");
      setPayNote("");
      showSaved("Payment recorded");
    } catch (err) {
      console.error("create payment error", err);
      alert("Unable to record payment");
    } finally {
      setCreatingPayment(false);
    }
  }

  const recentCharges = useMemo(() => {
    if (!billing?.charges) return [];
    return [...billing.charges].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [billing]);

  if (loadingPatient || !patient) {
    return <div>Loading patient...</div>;
  }

  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="text-sm text-[var(--hospital-subtle)] mt-1">
            {patient.contact?.phone ?? "—"} • DOB: {formatDate(patient.dob)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedMessage && <div className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm">{savedMessage}</div>}
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">
            Delete
          </button>
        </div>
      </div>

      {/* view toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("medical")}
          className={`px-4 py-2 rounded ${view === "medical" ? "bg-blue-600 text-white" : "border"}`}
        >
          Medical Details
        </button>
        <button
          onClick={() => setView("history")}
          className={`px-4 py-2 rounded ${view === "history" ? "bg-blue-600 text-white" : "border"}`}
        >
          History
        </button>
      </div>

      {/* Demographics / edit */}
      <div className="space-y-4 bg-[var(--hospital-surface)] p-4 rounded shadow mb-6 border border-[var(--hospital-border)]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Demographics</h2>
          <div>
            {editing ? (
              <>
                <button onClick={handleUpdate} disabled={submitting} className="px-3 py-1 bg-blue-600 text-white rounded mr-2">
                  {submitting ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setEditing(false); void fetchPatient(); }} className="px-3 py-1 border rounded">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-3 py-1 border rounded">
                Edit
              </button>
            )}
          </div>
        </div>

        {errorMessage && <div className="text-sm text-red-400">{errorMessage}</div>}

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={patient.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="input" placeholder="First name" />
            <input value={patient.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="input" placeholder="Last name" />
            <input type="date" value={patient.dob} onChange={(e) => handleChange("dob", e.target.value)} className="input" placeholder="DOB" />
            <select value={patient.gender} onChange={(e) => handleChange("gender", e.target.value)} className="input">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input value={patient.contact.phone} onChange={(e) => handleContactChange("phone", e.target.value)} className="input" placeholder="Phone" />
            <input value={patient.contact.email ?? ""} onChange={(e) => handleContactChange("email", e.target.value)} className="input" placeholder="Email" />
            <input value={patient.contact.address ?? ""} onChange={(e) => handleContactChange("address", e.target.value)} className="input md:col-span-3" placeholder="Address" />
          </div>
        ) : (
          <>
            <p>DOB: {formatDate(patient.dob)}</p>
            <p>Gender: {patient.gender}</p>
            <p>Phone: {patient.contact.phone}</p>
            <p>Email: {patient.contact.email ?? "—"}</p>
            <p>Address: {patient.contact.address ?? "—"}</p>
          </>
        )}
      </div>

      {/* content */}
      {view === "medical" ? (
        <>
          <Card title="Allergies" items={patient.allergies} />
          <Card title="Medical Conditions" items={patient.conditions} />
          <Card title="Medications" items={patient.medications} />
          <Card title="Immunizations" items={patient.immunizations} />

          {/* Billing summary snippet */}
          <div className="bg-[var(--hospital-surface)] p-4 rounded shadow mb-6 border border-[var(--hospital-border)]">
            <h2 className="font-medium mb-2">Billing Snapshot</h2>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-[var(--hospital-subtle)]">Balance</div>
                <div className="text-xl font-semibold">{billing ? formatMoney(billing.balance) : "₹0.00"}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--hospital-subtle)]">Recent charges</div>
                <ul className="text-sm mt-1">
                  {recentCharges.length === 0 ? <li className="text-[var(--hospital-subtle)]">No charges</li> : recentCharges.map((c, i) => (
                    <li key={i} className="flex justify-between">
                      <span className="text-sm">{c.code ?? "manual"} — {c.description ?? "-"}</span>
                      <span className="text-sm">{formatMoney(c.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Payments */}
          <div className="bg-[var(--hospital-surface)] p-4 rounded shadow border border-[var(--hospital-border)]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium">Payments</h2>
              <div className="text-sm text-[var(--hospital-subtle)]">{loadingHistory ? "Loading..." : ""}</div>
            </div>

            {history.payments.length === 0 ? (
              <p className="text-[var(--hospital-subtle)]">No payments recorded</p>
            ) : (
              <ul className="divide-y text-sm">
                {history.payments.map((p, i) => (
                  <li key={i} className="py-2 flex justify-between">
                    <div>{formatDate(p.date)} — {p.method} {p.note ? `(${p.note})` : ""}</div>
                    <div>{formatMoney(p.amount)}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Add payment form */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
              <input  value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Amount" className="input" />
              <select  value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className="input">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
              <input value={payNote} onChange={(e) => setPayNote(e.target.value)} placeholder="Note (optional)" className="input" />
              <div className="flex items-center">
                <button onClick={handleCreatePayment} disabled={creatingPayment} className="px-3 py-2 bg-green-600 text-white rounded w-full">
                  {creatingPayment ? "Saving..." : "Record Payment"}
                </button>
              </div>
            </div>
          </div>

          {/* Appointments history */}
          <div className="bg-[var(--hospital-surface)] p-4 rounded shadow border border-[var(--hospital-border)]">
            <h2 className="font-medium mb-2">Appointments</h2>
            {history.appointments.length === 0 ? (
              <p className="text-[var(--hospital-subtle)]">No appointments</p>
            ) : (
              <ul className="divide-y text-sm">
                {history.appointments.map((a) => (
                  <li key={a._id} className="py-2">
                    {formatDate(a.date)} {a.time ? ` ${a.time}` : ""} — {a.reason ?? "-"} <span className="text-[var(--hospital-subtle)]">({a.provider} • {a.status})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

/* small helpers & Card component */

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2 bg-[var(--hospital-surface)] p-4 rounded shadow mb-6 border border-[var(--hospital-border)]">
      <h2 className="font-medium">{title}</h2>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-[var(--hospital-text)]">
          {items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      ) : (
        <p className="text-[var(--hospital-subtle)] text-sm">No records</p>
      )}
    </div>
  );
}

function formatMoney(amount: number): string {
  // rupee by default; change as needed
  return `₹${amount.toFixed(2)}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    // client-only formatting is fine here because this is a client component
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}
