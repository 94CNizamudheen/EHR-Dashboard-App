"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "../../../lib/api";
import type { Patient } from "@/types/types";

interface Appointment {
  _id: string;
  provider: string;
  date: string;
  time: string;
  reason?: string;
  status: string;
}
interface Payment {
  amount: number;
  method: string;
  date: string;
  note?: string;
}
interface History {
  payments: Payment[];
  appointments: Appointment[];
}

export default function PatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [editing, setEditing] = useState(false);

  const [view, setView] = useState<"medical" | "history">("medical");
  const [history, setHistory] = useState<History>({ payments: [], appointments: [] });

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (view === "history" && id) {
      fetchHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, id]);

  const fetchPatient = async () => {
    try {
      const res = await API.get<Patient>(`/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      console.error("Error fetching patient", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get<History>(`/patients/history/${id}`);
      
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (!patient) return;
    setPatient({ ...patient, [field]: value });
  };

  const handleContactChange = (field: string, value: string) => {
    if (!patient) return;
    setPatient({ ...patient, contact: { ...patient.contact, [field]: value } });
  };

  const handleUpdate = async () => {
    if (!patient) return;
    try {
      const res = await API.put<Patient>(`/patients/${id}`, patient);
      setPatient(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating patient", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this patient?")) return;
    try {
      await API.delete(`/patients/${id}`);
      router.push("/patients");
    } catch (err) {
      console.error("Error deleting patient", err);
    }
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          {patient.firstName} {patient.lastName}
        </h1>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("medical")}
          className={`px-4 py-2 rounded ${
            view === "medical" ? "bg-blue-600 text-white" : "border"
          }`}
        >
          Medical Details
        </button>
        <button
          onClick={() => setView("history")}
          className={`px-4 py-2 rounded ${
            view === "history" ? "bg-blue-600 text-white" : "border"
          }`}
        >
          History
        </button>
      </div>

      {/* Demographics */}
      <div className="space-y-4 bg-white p-4 rounded shadow mb-6">
        <h2 className="font-medium">Demographics</h2>
        {editing ? (
          <div className="space-y-2">
            <input
              value={patient.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="First name"
            />
            <input
              value={patient.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Last name"
            />
            <input
              value={patient.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Date of birth"
            />
            <select
              value={patient.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              value={patient.contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Phone"
            />
            <input
              value={patient.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Email"
            />
            <input
              value={patient.contact.address}
              onChange={(e) => handleContactChange("address", e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Address"
            />
          </div>
        ) : (
          <>
            <p>DOB: {patient.dob}</p>
            <p>Gender: {patient.gender}</p>
            <p>Phone: {patient.contact.phone}</p>
            <p>Email: {patient.contact.email}</p>
            <p>Address: {patient.contact.address}</p>
          </>
        )}
      </div>

      {/* View toggle */}
      {view === "medical" ? (
        <>
          <Card title="Allergies" items={patient.allergies} />
          <Card title="Medical Conditions" items={patient.conditions} />
          <Card title="Medications" items={patient.medications} />
          <Card title="Immunizations" items={patient.immunizations} />
        </>
      ) : (
        <div className="space-y-6">
          {/* Payments */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-2">Payments</h2>
            {history.payments.length > 0 ? (
              <ul className="text-sm divide-y">
                {history.payments.map((p, i) => (
                  <li key={i} className="py-1 flex justify-between">
                    <span>
                      {p.date.slice(0, 10)} — {p.method}{" "}
                      {p.note ? `(${p.note})` : ""}
                    </span>
                    <span>{p.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No payments</p>
            )}
          </div>

          {/* Appointments */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-2">Appointments</h2>
            {history.appointments.length > 0 ? (
              <ul className="text-sm divide-y">
                {history.appointments.map((a) => (
                  <li key={a._id} className="py-1">
                    {a.date} {a.time} — {a.reason ?? "-"} ({a.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No appointments</p>
            )}
          </div>
        </div>
      )}

      {/* Edit buttons */}
      <div className="mt-4 flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 border rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2 bg-white p-4 rounded shadow mb-6">
      <h2 className="font-medium">{title}</h2>
      {items.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-gray-700">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No records</p>
      )}
    </div>
  );
}
