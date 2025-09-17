"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import type { Patient } from "@/types/types";
import Loading from "@/components/Loading";

export default function ClinicalPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
   const [loading,setLoading]=useState(false)
  const [q, setQ] = useState("");

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const res = await API.get<Patient[]>("/patients", { params: { q } });
      setPatients(res.data);
      setLoading(false)
    } catch (err) {
      console.error("Error fetching patients", err);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if(loading) return <Loading/>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight">Clinical Operations</h1>

      {/* Search */}
      <div className="flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone, email..."
          className="input flex-1"
        />
        <button
          onClick={fetchPatients}
          className="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          Search
        </button>
      </div>

      {/* Patient list */}
      <div className="space-y-3">
        {patients.map((p) => (
          <Link
            key={p._id}
            href={`/clinical/${p._id}`}
            className="block rounded-lg border border-[var(--hospital-border)] bg-[var(--hospital-surface)] p-4 shadow-md hover:shadow-lg hover:bg-[var(--hospital-muted)] transition"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[var(--hospital-text)]">
                {p.firstName} {p.lastName}
              </p>
              <p className="text-sm text-[var(--hospital-subtle)]">
                {p.contact.phone}
              </p>
            </div>
            {p.contact.email && (
              <p className="text-xs text-[var(--hospital-subtle)] mt-1">
                {p.contact.email}
              </p>
            )}
          </Link>
        ))}

        {patients.length === 0 && (
          <div className="p-6 text-center rounded-lg border border-[var(--hospital-border)] bg-[var(--hospital-surface)] text-[var(--hospital-subtle)]">
            No patients found
          </div>
        )}
      </div>
    </div>
  );
}
