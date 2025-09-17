"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "../../../lib/api";
import { Appointment } from "@/types/types";
import Loading from "@/components/Loading";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (form.provider.trim().length < 3) {
      newErrors.provider = "Provider name must be at least 3 characters";
    }
    if (!form.date) {
      newErrors.date = "Date is required";
    }
    if (!form.time) {
      newErrors.time = "Time is required";
    }
    if (form.date && form.time) {
      const chosen = new Date(`${form.date}T${form.time}`);
      if (chosen < new Date()) {
        newErrors.time = "Appointment must be in the future";
      }
    }
    if (form.reason && form.reason.trim().length > 0 && form.reason.trim().length < 5) {
      newErrors.reason = "Reason must be at least 5 characters if provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

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

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-[var(--hospital-primary)]/20 text-[var(--hospital-primary)]";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  if (!appt) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Appointment Details</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
            appt.status
          )}`}
        >
          {appt.status}
        </span>
      </div>

      {/* Card */}
      <div className="space-y-4 bg-[var(--hospital-surface)] p-6 rounded-xl shadow-lg border border-[var(--hospital-border)]">
        {/* Patient info */}
        <div className="pb-4 border-b border-[var(--hospital-border)]">
          <p className="font-semibold text-lg">Patient</p>
          <p className="text-[var(--hospital-subtle)]">
            {typeof appt.patient === "string"
              ? appt.patient
              : `${appt.patient.firstName} ${appt.patient.lastName} (${appt.patient.contact.phone})`}
          </p>
        </div>

        {editing ? (
          <>
            <div className="space-y-3">
              {/* Date */}
              <div>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`input ${errors.date ? "input--error" : ""}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={`input ${errors.time ? "input--error" : ""}`}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>

              {/* Provider */}
              <div>
                <input
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  placeholder="Provider"
                  className={`input ${errors.provider ? "input--error" : ""}`}
                />
                {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider}</p>}
              </div>

              {/* Reason */}
              <div>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason"
                  className={`input ${errors.reason ? "input--error" : ""}`}
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 rounded-lg border border-[var(--hospital-border)] hover:bg-[var(--hospital-muted)] transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Date:</span> {appt.date}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {appt.time}
              </p>
              <p>
                <span className="font-semibold">Provider:</span> {appt.provider}
              </p>
              <p>
                <span className="font-semibold">Reason:</span> {appt.reason || "-"}
              </p>
            </div>

            {appt.status === "scheduled" && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="px-5 py-2.5 rounded-lg border border-[var(--hospital-border)] hover:bg-[var(--hospital-muted)] transition"
                >
                  Reschedule
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Complete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
