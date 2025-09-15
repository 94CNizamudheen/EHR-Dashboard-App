"use client";
import { useEffect, useState } from "react";
import { FHIR } from "@/lib/fhir-client";
import { Coverage, FhirBundle } from "@/lib/types";

export default function BillingPage() {
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("ehr_token") || "" : "";

  async function load() {
    const res: FhirBundle<Coverage> = await FHIR.coverage.list(token);
    setCoverages(res.entry?.map((e) => e.resource) || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Billing & Coverage</h1>
      <button
        onClick={async () => {
          await FHIR.coverage.create(token, {
            resourceType: "Coverage",
            status: "active",
            beneficiary: { reference: "Patient/123" },
            payor: [{ display: "Insurance Company A" }],
          });
          load();
        }}
      >
        ➕ Add Coverage
      </button>

      <ul>
        {coverages.map((c) => (
          <li key={c.id}>
            {c.payor?.[0]?.display} ({c.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
