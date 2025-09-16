
"use client";

import { useState } from "react";
import {API} from "../lib/api";
import type { Gender, Patient } from "@/types/types"; 

interface Props {
  onCreated: (p: Patient) => void;
}

export default function CreatePatientModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post<Patient>("/patients", {
        firstName,
        lastName,
        dob,
        gender,
        contact: { phone, email, address },
        allergies: [],
        conditions: [],
        medications: [],
        immunizations: [],
      });
      onCreated(res.data);
      setOpen(false);
      setFirstName(""); setLastName(""); setDob(""); setPhone(""); setEmail(""); setAddress("");
    } catch (err) {
      console.error("Error creating patient", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add Patient
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 ">Create Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="First name"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input className="w-full border p-2 rounded" placeholder="Last name"
                value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <input className="w-full border p-2 rounded" placeholder="DOB (YYYY-MM-DD)"
                value={dob} onChange={(e) => setDob(e.target.value)} required />
              <select className="w-full border p-2 rounded"
                value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input className="w-full border p-2 rounded" placeholder="Phone"
                value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="w-full border p-2 rounded" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="w-full border p-2 rounded" placeholder="Address"
                value={address} onChange={(e) => setAddress(e.target.value)} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
