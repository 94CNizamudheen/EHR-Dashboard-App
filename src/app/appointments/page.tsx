"use client";

import { useEffect, useState } from "react";
import {API} from "../../lib/api";
import type { Appointment } from "@/types/types";
import Link from "next/link";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await API.get<Appointment[]>("/appointments", {
        params: { date },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Appointments</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Filter
        </button>
        <Link
          href="/appointments/new"
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
        >
          Book Appointment
        </Link>
      </div>

      <div className="bg-white rounded shadow divide-y">
        {appointments.map((a) => (
          <Link
            key={a._id}
            href={`/appointments/${a._id}`}
            className="flex justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span>
              {a.date} {a.time} — {a.patient.firstName} {a.patient.lastName}
            </span>
            <span className="text-sm text-gray-500">{a.provider}</span>
          </Link>
        ))}
        {appointments.length === 0 && (
          <div className="p-4 text-gray-500">No appointments found</div>
        )}
      </div>
    </div>
  );
}
