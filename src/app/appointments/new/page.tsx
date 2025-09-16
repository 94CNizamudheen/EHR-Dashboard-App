"use client";

import { useState } from "react";
import {API} from "../../../lib/api";
import { useRouter } from "next/navigation";
import type { Patient } from "@/types/types";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckPatient = async () => {
    setLoading(true);
    try {
      const res = await API.get<Patient[]>("/patients", { params: { q: phone } });
      const found = res.data.find((p) => p.contact.phone === phone);
      setPatient(found || null);
    } catch (err) {
      console.error("Error searching patient", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) {
      alert("No patient found with this mobile number.");
      return;
    }
    try {
      await API.post("/appointments", {
        phone,
        provider,
        date,
        time,
        reason,
      });
      router.push("/appointments");
    } catch (err) {
      alert("Error booking appointment: " + (err as Error).message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Book New Appointment</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* Patient mobile */}
        <div className="flex gap-2">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Patient mobile number"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <button
            type="button"
            onClick={handleCheckPatient}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>
        {patient ? (
          <p className="text-green-600">
            Patient found: {patient.firstName} {patient.lastName}
          </p>
        ) : (
          phone && <p className="text-red-600">No patient record found</p>
        )}

        {/* Provider */}
        <input
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="Provider name"
          className="border px-3 py-2 rounded w-full"
          required
        />

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />

        {/* Time */}
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />


        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="border px-3 py-2 rounded w-full"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}
