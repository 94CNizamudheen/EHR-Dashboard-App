


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {API} from "../../../lib/api";
import  { Appointment } from "@/types/types";

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [appt, setAppt] = useState<Appointment | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    provider: "",
    reason: "",
  });

  useEffect(() => {
    const fetchAppt = async () => {
      try {
        const res = await API.get<Appointment>(`/appointments/${id}`);
        setAppt(res.data);
        setForm({
          date: res.data.date,
          time: res.data.time,
          provider: res.data.provider,
          reason: res.data.reason || "",
        });
      } catch (err) {
        console.error("Error fetching appointment", err);
      }
    };
    if (id) fetchAppt();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await API.put<Appointment>(`/appointments/${id}`, form);
      setAppt(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating appointment", err);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await API.put(`/appointments/${id}`, { status: "cancelled" });
      router.push("/appointments");
    } catch (err) {
      console.error("Error cancelling appointment", err);
    }
  };

  const handleComplete = async () => {
    try {
      await API.put(`/appointments/${id}`, { status: "completed" });
      router.push("/appointments");
    } catch (err) {
      console.error("Error completing appointment", err);
    }
  };

  if (!appt) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Appointment Details</h1>
        <span
          className={`px-2 py-1 rounded text-sm ${
            appt.status === "scheduled"
              ? "bg-blue-100 text-blue-700"
              : appt.status === "completed"
              ? "bg-green-100 text-green-700"
              : appt.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {appt.status}
        </span>
      </div>

      <div className="space-y-4 bg-white p-4 rounded shadow">
        {/* Patient info */}
        <p>
          <strong>Patient:</strong>{" "}
          {typeof appt.patient === "string"
            ? appt.patient
            : `${appt.patient.firstName} ${appt.patient.lastName} (${appt.patient.contact.phone})`}
        </p>

        {editing ? (
          <>
            <div className="space-y-2">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border px-2 py-1 rounded w-full"
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="border px-2 py-1 rounded w-full"
              />
              <input
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                placeholder="Provider"
                className="border px-2 py-1 rounded w-full"
              />
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Reason"
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Date:</strong> {appt.date}
            </p>
            <p>
              <strong>Time:</strong> {appt.time}
            </p>
            <p>
              <strong>Provider:</strong> {appt.provider}
            </p>
            <p>
              <strong>Reason:</strong> {appt.reason || "-"}
            </p>

            <div className="flex gap-2 mt-4">
              {appt.status === "scheduled" && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 border rounded"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleComplete}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Complete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
