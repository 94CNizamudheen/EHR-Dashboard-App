"use client";

import { useEffect, useState } from "react";
import { API } from "../../lib/api";
import type { Appointment } from "@/types/types";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {

      const res = await API.get<Appointment[]>("/appointments", {
        params: { date },
      });
      setLoading(false)
      setAppointments(res.data);
    } catch (err) {
      setLoading(false)
      console.error("Error fetching appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };
  if (loading) return <Loading />
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>

      {/* Filter + Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <button
          onClick={fetchAppointments}
          className="px-5 py-2.5 rounded-lg font-medium tracking-wide
             bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 
             text-[var(--hospital-bg)]
             shadow-md hover:shadow-lg 
             transform hover:-translate-y-0.5
             transition-all duration-200"
        >
          Filter
        </button>

        <Link
          href="/appointments/new"
          className="ml-auto px-5 py-2.5 rounded-lg font-medium tracking-wide
             bg-gradient-to-r from-[var(--hospital-accent)] to-amber-400
             text-[var(--hospital-bg)]
             shadow-md hover:shadow-lg 
             transform hover:-translate-y-0.5
             transition-all duration-200"
        >
          + Book Appointment
        </Link>
      </div>

      {/* Appointment List */}
      <div className="grid gap-4">
        {appointments.map((a) => (
          <Link
            key={a._id}
            href={`/appointments/${a._id}`}
            className="block rounded-xl border border-[var(--hospital-border)] bg-[var(--hospital-surface)] p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-[var(--hospital-text)]">
                  {a.patient.firstName} {a.patient.lastName}
                </p>
                <p className="text-sm text-[var(--hospital-subtle)]">
                  {a.date} at {a.time} — provider ({a.provider})
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </div>
          </Link>
        ))}

        {appointments.length === 0 && (
          <div className="p-6 text-center rounded-lg border border-[var(--hospital-border)] bg-[var(--hospital-surface)] text-[var(--hospital-subtle)]">
            No appointments found
          </div>
        )}
      </div>
    </div >
  );
}
