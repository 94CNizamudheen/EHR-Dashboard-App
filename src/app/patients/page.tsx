"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [debounceMs] = useState(() => 350);
  const [trigger, setTrigger] = useState(0);

  async function fetchPatients(query: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get<Patient[]>("/patients", { params: { q: query } });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
      setError("Unable to load patients");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const t = setTimeout(() => {
      setTrigger((s) => s + 1);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [q, debounceMs]);

  useEffect(() => {
    void fetchPatients(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // callback for created patient (prepend)
  const handleCreated = (p: Patient) => {
    setPatients((prev) => [p, ...prev]);
  };

  const filteredCount = useMemo(() => patients.length, [patients]);
  if (loading) return <Loading />
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Patient Management</h1>
          <div className="text-sm text-[var(--hospital-subtle)] mt-1">Total: {filteredCount}</div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <CreatePatientModal onCreated={handleCreated} />
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex gap-2 mb-4"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone, or email"
          className="input w-full"
          aria-label="Search patients"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Search
        </button>
      </form>

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

        {!loading && patients.map((p) => (
          <Link
            key={p._id}
            href={`/patients/${p._id}`}
            className="flex justify-between px-4 py-3 hover:bg-[var(--hospital-muted)]"
          >
            <div>
              <div className="font-medium">{p.firstName} {p.lastName}</div>
              <div className="text-xs text-[var(--hospital-subtle)]">{p.contact.email ?? "—"} • DOB: {p.dob}</div>
            </div>
            <div className="text-sm text-[var(--hospital-subtle)]">{p.contact.phone}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
