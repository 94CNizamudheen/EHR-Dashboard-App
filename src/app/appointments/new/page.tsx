"use client";

import { useState, useEffect } from "react";
import { API } from "../../../lib/api";
import { useRouter } from "next/navigation";
import type { Patient, BillingCode } from "@/types/types";

export default function NewAppointmentPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [provider, setProvider] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [codes, setCodes] = useState<BillingCode[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch billing codes
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await API.get<BillingCode[]>("/billing/codes");
        setCodes(res.data);
      } catch (err) {
        console.warn("Unable to load billing codes", err);
      }
    };
    fetchCodes();
  }, []);

  // Search patients
  const handleSearchPatients = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await API.get<Patient[]>("/patients", { params: { q: query } });
      setPatients(res.data);
      setSelectedPatient(null);
    } catch (err) {
      console.error("Error searching patients", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedPatient) newErrors.patient = "Please select a patient";
    if (provider.trim().length < 3)
      newErrors.provider = "Provider name must be at least 3 characters";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (date && time) {
      const chosen = new Date(`${date}T${time}`);
      if (chosen < new Date())
        newErrors.time = "Appointment must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit appointment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        patientId: selectedPatient?._id,
        provider,
        date,
        time,
        reason,
        billingCode: selectedCode || undefined,
      };
      const res = await API.post("/appointments", payload);
      const { charge } = res.data as { charge?: BillingCode | null };
      if (charge) {
        alert(
          `Appointment booked. Charge added: ${charge.code} (${charge.amount})`
        );
      } else {
        alert("Appointment booked.");
      }
      router.push("/appointments");
    } catch (err) {
      alert("Error booking appointment: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Book New Appointment</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-[var(--hospital-surface)] p-6 rounded-xl shadow-lg border border-[var(--hospital-border)]"
      >
        {/* Patient Search */}
        <div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient (name, phone, email)"
              className="input"
            />
            <button
              type="button"
              onClick={handleSearchPatients}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {hasSearched && !loading && (
            <>
              {patients.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-[var(--hospital-subtle)]">
                    Select a patient:
                  </p>
                  <div className="space-y-2">
                    {patients.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => setSelectedPatient(p)}
                        className={`p-3 rounded-lg border cursor-pointer transition ${
                          selectedPatient?._id === p._id
                            ? "border-[var(--hospital-primary)] bg-[var(--hospital-muted)]"
                            : "border-[var(--hospital-border)] hover:bg-[var(--hospital-muted)]"
                        }`}
                      >
                        <p className="font-medium">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-sm text-[var(--hospital-subtle)]">
                          {p.contact.phone} • {p.contact.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-red-500 text-sm mt-2">
                  ❌ No patient record found
                </p>
              )}
            </>
          )}
          {errors.patient && (
            <p className="text-red-500 text-sm mt-1">{errors.patient}</p>
          )}
        </div>

        {/* Provider */}
        <div>
          <input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Provider name"
            className={`input ${errors.provider ? "input--error" : ""}`}
            required
          />
          {errors.provider && (
            <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`input ${errors.date ? "input--error" : ""}`}
            required
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`input ${errors.time ? "input--error" : ""}`}
            required
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>

        {/* Billing code selector */}
        <div>
          <label className="block text-sm text-[var(--hospital-subtle)] mb-1">
            Billing code (optional)
          </label>
          <div className="select-wrapper">
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="input"
            >
              <option value="">— No charge / choose code —</option>
              {codes.map((c) => (
                <option key={c._id} value={c.code}>
                  {c.code} — {c.description} ({c.amount})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="input"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-3 rounded-lg font-semibold bg-gradient-to-r from-[var(--hospital-accent)] to-amber-400 text-[var(--hospital-bg)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
