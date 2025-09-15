"use client";
import { useEffect, useState } from "react";
import { FHIR } from "@/lib/fhir-client";
import { Appointment, FhirBundle } from "@/lib/types";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("ehr_token") || "" : "";

  async function load() {
    const res: FhirBundle<Appointment> = await FHIR.appointments.list(token);
    setAppointments(res.entry?.map((e) => e.resource) || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Appointments</h1>
      <button
        onClick={async () => {
          await FHIR.appointments.create(token, {
            resourceType: "Appointment",
            status: "booked",
            description: "General Checkup",
            start: "2025-09-15T10:00:00Z",
            end: "2025-09-15T10:30:00Z",
          });
          load();
        }}
      >
        ➕ Add Appointment
      </button>

      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            {a.description} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
