"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {API} from "../../lib/api";
import type { Patient } from "@/types/types";

export default function ClinicalPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [q, setQ] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await API.get<Patient[]>("/patients", { params: { q } });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Clinical Operations</h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone, email..."
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={fetchPatients}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Patient list */}
      <div className="bg-white rounded shadow divide-y">
        {patients.map((p) => (
          <Link
            key={p._id}
            href={`/clinical/${p._id}`}
            className="flex justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span>
              {p.firstName} {p.lastName}
            </span>
            <span className="text-sm text-gray-500">{p.contact.phone}</span>
          </Link>
        ))}
        {patients.length === 0 && (
          <div className="p-4 text-gray-500">No patients found</div>
        )}
      </div>
    </div>
  );
}
