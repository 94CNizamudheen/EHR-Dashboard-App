"use client";
import { useEffect, useState } from "react";
import { FHIR } from "@/lib/fhir-client";
import { Patient, FhirBundle } from "@/lib/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("ehr_token") || "" : "";

  async function load() {
    const res: FhirBundle<Patient> = await FHIR.patients.list(token);
    setPatients(res.entry?.map((e) => e.resource) || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Patients</h1>
      <button
        onClick={async () => {
          await FHIR.patients.create(token, {
            resourceType: "Patient",
            name: [{ family: "Doe", given: ["John"] }],
            gender: "male",
            birthDate: "1990-01-01",
          });
          load();
        }}
      >
        ➕ Add
      </button>

      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name?.[0]?.given?.join(" ")} {p.name?.[0]?.family}
          </li>
        ))}
      </ul>
    </div>
  );
}
