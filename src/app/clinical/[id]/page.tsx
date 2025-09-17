"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "@/lib/api";
import type {
    ClinicalNote,
    Patient,
    BillingCode,
    BillingAccount,
} from "@/types/types";
import VitalsSection from "@/components/VitalSection";
import LabsSection from "@/components/LabSection";
import EncountersSection from "@/components/EncountersSection";
import EditableListSection from "@/components/EditableListSection";
import Loading from "@/components/Loading";

export default function ClinicalDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;

    const [patient, setPatient] = useState<Patient | null>(null);

    // billing
    const [billingAccount, setBillingAccount] = useState<BillingAccount | null>(null);
    const [codes, setCodes] = useState<BillingCode[]>([]);
    const [selectedCode, setSelectedCode] = useState<string>("");
    const [manualAmount, setManualAmount] = useState<number | "">("");

    // clinical lists & note
    const [note, setNote] = useState("");
    const [medications, setMedications] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const [immunizations, setImmunizations] = useState<string[]>([]);

    // ui
    const [loading, setLoading] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        void initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function initialize() {
        await Promise.all([fetchPatient(), fetchBillingCodes(), fetchBillingAccount()]);
    }

    async function fetchPatient() {
        if (!id) return;
        try {
            setLoading(true);
            const res = await API.get<Patient>(`/patients/${id}`);
            setPatient(res.data);
            setMedications(res.data.medications ?? []);
            setAllergies(res.data.allergies ?? []);
            setConditions(res.data.conditions ?? []);
            setImmunizations(res.data.immunizations ?? []);
        } catch (err) {
            console.error("Error fetching patient", err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBillingAccount() {
        if (!id) return;
        try {
            const res = await API.get<BillingAccount>(`/billing/account/${id}`);
            setBillingAccount(res.data);
        } catch {
            // account might not exist yet — that's OK
            setBillingAccount(null);
        }
    }

    async function fetchBillingCodes() {
        try {
            const res = await API.get<BillingCode[]>("/billing/codes");
            setCodes(res.data);
        } catch (err) {
            console.warn("Unable to load billing codes", err);
            setCodes([]);
        }
    }

    function showSaved(msg: string) {
        setSavedMessage(msg);
        setTimeout(() => setSavedMessage(null), 2500);
    }

    // ---------- clinical actions ----------

    const addNote = async () => {
        if (!id || !note.trim()) return;
        try {
            setLoading(true);
            await API.post(`/clinical/${id}/notes`, { text: note.trim(), author: "Dr. Admin" });
            setNote("");
            await fetchPatient();
            showSaved("Note saved");
        } catch (err) {
            console.error("Error adding note", err);
            alert("Failed to save note");
        } finally {
            setLoading(false);
        }
    };

    const saveMedications = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await API.put(`/clinical/${id}/medications`, { medications });
            await fetchPatient();
            showSaved("Medications saved");
        } catch (err) {
            console.error("Error saving medications", err);
            alert("Failed to save medications");
        } finally {
            setLoading(false);
        }
    };

    const saveAllergies = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await API.put(`/clinical/${id}/allergies`, { allergies });
            await fetchPatient();
            showSaved("Allergies saved");
        } catch (err) {
            console.error("Error saving allergies", err);
            alert("Failed to save allergies");
        } finally {
            setLoading(false);
        }
    };

    const saveConditions = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await API.put(`/clinical/${id}/conditions`, { conditions });
            await fetchPatient();
            showSaved("Conditions saved");
        } catch (err) {
            console.error("Error saving conditions", err);
            alert("Failed to save conditions");
        } finally {
            setLoading(false);
        }
    };

    const saveImmunizations = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await API.put(`/clinical/${id}/immunizations`, { immunizations });
            await fetchPatient();
            showSaved("Immunizations saved");
        } catch (err) {
            console.error("Error saving immunizations", err);
            alert("Failed to save immunizations");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCharge = async () => {
        if (!id) return;
        if (!selectedCode && (manualAmount === "" || Number(manualAmount) <= 0)) {
            alert("Choose a billing code or enter a manual amount");
            return;
        }

        try {
            setLoading(true);
            const payload: Record<string, unknown> = {};
            if (selectedCode) payload.code = selectedCode;
            if (manualAmount !== "" && Number(manualAmount) > 0) payload.amount = Number(manualAmount);

            const res = await API.post<{ balance: number; charge: { code?: string; description?: string; amount: number } }>(
                `/billing/${id}/charge`,
                payload
            );

            await fetchBillingAccount();
            await fetchPatient();

            const charge = res.data.charge;
            showSaved(`Charge created ${charge.code ?? ""} (${charge.amount})`);
            setSelectedCode("");
            setManualAmount("");
        } catch (err) {
            console.error("Error creating charge", err);
            alert("Unable to create charge: " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        router.push("/clinical");
    };

    if (!patient) return <div>No patient records</div>;
    if (loading) return <Loading />
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--hospital-text)]">
                        Clinical Records: {patient.firstName} {patient.lastName}
                    </h1>
                    <div className="text-sm text-[var(--hospital-subtle)] mt-1">
                        {patient.contact?.phone ?? "—"} • DOB: {patient.dob}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Billing summary */}
                    <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] rounded-xl px-4 py-3 text-sm text-right shadow-md">
                        <div className="font-medium">Balance</div>
                        <div className="text-lg font-semibold text-[var(--hospital-text)]">
                            {billingAccount ? billingAccount.balance.toFixed(2) : "0.00"}
                        </div>
                        <div className="text-xs text-[var(--hospital-subtle)] mt-1">
                            {billingAccount
                                ? `${billingAccount.charges.length} charges`
                                : "no account"}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {savedMessage && (
                            <div className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
                                {savedMessage}
                            </div>
                        )}
                        <button
                            onClick={handleComplete}
                            className="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            Complete
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <section className="bg-[var(--hospital-surface)] p-5 rounded-xl shadow-lg border border-[var(--hospital-border)]">
                <h2 className="font-semibold mb-3 text-lg">Clinical Notes</h2>

                <ul className="text-sm space-y-1">
                    {patient.notes.length > 0 ? (
                        patient.notes.map((n: ClinicalNote, i: number) => (
                            <li key={i}>
                                <span className="font-semibold">{n.author}</span>: {n.text}{" "}
                                <span className="text-[var(--hospital-subtle)] text-xs">
                                    ({n.date})
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="text-[var(--hospital-subtle)]">No notes</li>
                    )}
                </ul>

                <div className="flex gap-2 mt-4">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add note..."
                        className="input flex-1"
                    />
                    <button
                        onClick={addNote}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </section>

            {/* Billing: Create Charge */}
            <section className="bg-[var(--hospital-surface)] p-5 rounded-xl shadow-lg border border-[var(--hospital-border)]">
                <h2 className="font-semibold mb-3 text-lg">Create Charge</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-[var(--hospital-subtle)] mb-1">
                            Billing code (optional)
                        </label>
                        <select
                            value={selectedCode}
                            onChange={(e) => setSelectedCode(e.target.value)}
                            className="input"
                        >
                            <option value="">— choose code —</option>
                            {codes.map((c) => (
                                <option key={c._id} value={c.code}>
                                    {c.code} — {c.description} ({c.amount})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--hospital-subtle)] mb-1">
                            Manual amount (optional)
                        </label>
                        <input
                            value={manualAmount}
                            onChange={(e) => {
                                const v = e.target.value.trim();
                                if (v === "") setManualAmount("");
                                else {
                                    const num = parseFloat(v);
                                    setManualAmount(Number.isNaN(num) ? "" : num);
                                }
                            }}
                            placeholder="e.g. 150.00"
                            className="input"
                        />
                        <div className="text-xs text-[var(--hospital-subtle)] mt-1">
                            If a code is selected, that code&apos;s amount will be used. Otherwise provide an amount.
                        </div>
                    </div>
                </div>

                {(selectedCode || manualAmount) && (
                    <div className="mt-4 p-3 border border-[var(--hospital-border)] rounded-lg bg-yellow-500/10 flex justify-between items-center">
                        <div className="text-sm text-[var(--hospital-text)]">
                            {selectedCode
                                ? `Selected code: ${selectedCode}`
                                : `Manual amount: ${manualAmount}`}
                        </div>
                        <button
                            onClick={handleCreateCharge}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            Confirm Charge
                        </button>
                    </div>
                )}
            </section>

            <EditableListSection
                title="Medications"
                items={medications}
                setItems={setMedications}
                onSave={saveMedications}
            />
            <EditableListSection
                title="Allergies"
                items={allergies}
                setItems={setAllergies}
                onSave={saveAllergies}
       
            />
            <EditableListSection
                title="Medical Conditions"
                items={conditions}
                setItems={setConditions}
                onSave={saveConditions}
               
            />
            <EditableListSection
                title="Immunizations"
                items={immunizations}
                setItems={setImmunizations}
                onSave={saveImmunizations}
            />

            <VitalsSection id={id} onSaved={fetchPatient} />
            <LabsSection id={id} onSaved={fetchPatient} />
            <EncountersSection id={id} onSaved={fetchPatient} />
        </div>
    );

}


