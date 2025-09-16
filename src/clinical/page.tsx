"use client";
import { useEffect, useState } from "react";
import { FHIR } from "@/lib/ehrService";
import { Observation, FhirBundle } from "@/lib/types";

export default function ClinicalPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("ehr_token") || "" : "";

  async function load() {
    const res: FhirBundle<Observation> = await FHIR.observations.list(token);
    setObservations(res.entry?.map((e) => e.resource) || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Clinical Observations</h1>
      <button
        onClick={async () => {
          await FHIR.observations.create(token, {
            resourceType: "Observation",
            status: "final",
            code: { text: "Blood Pressure" },
            valueString: "120/80",
          });
          load();
        }}
      >
        ➕ Add Observation
      </button>

      <ul>
        {observations.map((o) => (
          <li key={o.id}>
            {o.code.text}: {o.valueString} ({o.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
