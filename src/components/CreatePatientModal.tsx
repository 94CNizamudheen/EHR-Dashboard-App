"use client";

import { useState } from "react";
import {API} from "@/lib/api";
import type { Patient } from "@/types/types";
import Loading from "./Loading";

export default function CreatePatientModal({ onCreated }: { onCreated: (p: Patient) => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Patient["gender"]>("male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [immunizations, setImmunizations] = useState("");
 const [loading,setLoading]=useState(false)
  function resetForm() {
    setFirstName("");
    setLastName("");
    setDob("");
    setGender("male");
    setPhone("");
    setEmail("");
    setAddress("");
    setAllergies("");
    setConditions("");
    setMedications("");
    setImmunizations("");
    setError(null);
  }

  async function handleCreate(e?: React.FormEvent) {
    setLoading(true)
    e?.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !dob.trim() || !phone.trim()) {
      setError("Please fill required fields: first name, last name, DOB and phone.");
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob: dob.trim(),
      gender,
      contact: { phone: phone.trim(), email: email.trim(), address: address.trim() },
      allergies: allergies ? allergies.split(",").map((s) => s.trim()).filter(Boolean) : [],
      conditions: conditions ? conditions.split(",").map((s) => s.trim()).filter(Boolean) : [],
      medications: medications ? medications.split(",").map((s) => s.trim()).filter(Boolean) : [],
      immunizations: immunizations ? immunizations.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };

    try {
      setSubmitting(true);
      const res = await API.post<Patient>("/patients", payload);
      const created = res.data;
      onCreated(created);
      resetForm();
      setOpen(false);
    } catch (err: unknown) {
      console.error("Create patient error", err);
      setError((err as Error)?.message ?? "Unable to create patient");
    } finally {
      setSubmitting(false);
      setLoading(false)
    }
  }
  if(loading) return <Loading/>
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">
        + Add Patient
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <form
            onSubmit={handleCreate}
            className="z-10 w-full max-w-2xl bg-[var(--hospital-surface)] border border-[var(--hospital-border)] rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Patient</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-[var(--hospital-subtle)]">
                Close
              </button>
            </div>

            {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="input" placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input className="input" placeholder="Last name *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <input type="date" className="input" placeholder="DOB *" value={dob} onChange={(e) => setDob(e.target.value)} />
              <select className="input" value={gender} onChange={(e) => setGender(e.target.value as Patient["gender"])}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input className="input" placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="input md:col-span-3" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button type="button" onClick={() => { resetForm(); setOpen(false); }} className="px-3 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground rounded">
                {submitting ? "Saving..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
