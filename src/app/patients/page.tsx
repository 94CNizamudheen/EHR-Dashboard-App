"use client";

import { useEffect, useState } from "react";
import { API } from "../../lib/api";
import type { Patient } from "@/types/types";
import Link from "next/link";
import CreatePatientModal from "../../components/CreatePatientModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [q, setQ] = useState("");



  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get<Patient[]>("/patients", { params: { q } });
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients", err);
      }
    };
    fetchPatients()
  }, [q, setPatients]);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4 ">
        <h1 className="text-2xl font-semibold ">Patient Management</h1>

        <CreatePatientModal onCreated={(p) => setPatients((prev) => [p, ...prev])} />
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
          className="border px-3 py-2 rounded w-full"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>

      {/* Patient list */}
      <div className="bg-white rounded shadow divide-y">
        {patients.map((p) => (
          <Link
            key={p._id}
            href={`/patients/${p._id}`}
            className="flex justify-between px-4 py-3 hover:bg-gray-50"
          >
            <span>
              {p.firstName} {p.lastName} ({p.gender})
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
