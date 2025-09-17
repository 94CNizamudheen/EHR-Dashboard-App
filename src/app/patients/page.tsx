"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import type { Patient } from "@/types/types";
import Link from "next/link";
import CreatePatientModal from "@/components/CreatePatientModal";
import Loading from "@/components/Loading";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPatients() {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get<Patient[]>("/patients", { params: { q } });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
      setError("Unable to load patients");
    } finally {
      setLoading(false);
    }
  }

  // Load all patients once initially
  useEffect(() => {
    void fetchPatients();
  }, []);

  // callback for created patient (prepend)
  const handleCreated = (p: Patient) => {
    setPatients((prev) => [p, ...prev]);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Patient Management</h1>
          <div className="text-sm text-[var(--hospital-subtle)] mt-1">
            Total: {patients.length}
          </div>
        </div>

        <div>
          <CreatePatientModal onCreated={handleCreated} />
        </div>
      </div>

      {/* Search input + button */}
      <div className="flex gap-3 mb-4">
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

      {/* Patients list */}
      <div className="bg-[var(--hospital-surface)] rounded shadow divide-y border border-[var(--hospital-border)]">
        {loading && (
          <div className="p-4 text-sm text-[var(--hospital-subtle)]">Loading patients…</div>
        )}

        {!loading && error && (
          <div className="p-4 text-sm text-red-400">{error}</div>
        )}

        {!loading && !error && patients.length === 0 && (
          <div className="p-6 text-sm text-[var(--hospital-subtle)]">No patients found</div>
        )}

        {!loading &&
          patients.map((p) => (
            <Link
              key={p._id}
              href={`/patients/${p._id}`}
              className="flex justify-between px-4 py-3 hover:bg-[var(--hospital-muted)]"
            >
              <div>
                <div className="font-medium">
                  {p.firstName} {p.lastName}
                </div>
                <div className="text-xs text-[var(--hospital-subtle)]">
                  {p.contact.email ?? "—"} • DOB: {p.dob}
                </div>
              </div>
              <div className="text-sm text-[var(--hospital-subtle)]">
                {p.contact.phone}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
