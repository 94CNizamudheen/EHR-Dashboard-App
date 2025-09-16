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

    // ---------- billing: create charge from clinical page ----------

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

    if (!patient) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Clinical Records: {patient.firstName} {patient.lastName}
                    </h1>
                    <div className="text-sm text-gray-600 mt-1">
                        {patient.contact?.phone ?? "—"} • DOB: {patient.dob}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Billing summary */}
                    <div className="bg-white border rounded px-3 py-2 text-sm text-right">
                        <div className="font-medium">Balance</div>
                        <div className="text-lg">{billingAccount ? billingAccount.balance.toFixed(2) : "0.00"}</div>
                        <div className="text-xs text-gray-500 mt-1">{billingAccount ? `${billingAccount.charges.length} charges` : "no account"}</div>
                    </div>

                    <div className="flex items-center gap-3">
                        {savedMessage && <div className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm">{savedMessage}</div>}
                        <button onClick={handleComplete} className="px-4 py-2 bg-blue-600 text-white rounded">
                            Complete
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <section className="bg-white p-4 rounded shadow mb-4">
                <h2 className="font-medium mb-2">Clinical Notes</h2>

                <ul className="text-sm text-gray-700 space-y-1">
                    {patient.notes.length > 0 ? (
                        patient.notes.map((n: ClinicalNote, i: number) => (
                            <li key={i}>
                                <span className="font-semibold">{n.author}</span>: {n.text}{" "}
                                <span className="text-gray-400 text-xs">({n.date})</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No notes</li>
                    )}
                </ul>

                <div className="flex gap-2 mt-3">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add note..."
                        className="border px-2 py-1 rounded flex-1"
                    />
                    <button onClick={addNote} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">
                        Save
                    </button>
                </div>
            </section>

            {/* Billing: Create Charge */}
            <section className="bg-white p-4 rounded shadow mb-4">
                <h2 className="font-medium mb-2">Create Charge</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Billing code (optional)</label>
                        <select
                            value={selectedCode}
                            onChange={(e) => setSelectedCode(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
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
                        <label className="block text-sm text-gray-600 mb-1">Manual amount (optional)</label>
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
                            className="border px-3 py-2 rounded w-full"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            If a code is selected, that code&apos;s amount will be used. Otherwise provide an amount.
                        </div>
                    </div>
                </div>

                {/* Pending charge confirmation */}
                {(selectedCode || manualAmount) && (
                    <div className="mt-4 p-3 border rounded bg-yellow-50 flex justify-between items-center">
                        <div className="text-sm">
                            {selectedCode
                                ? `Selected code: ${selectedCode}`
                                : `Manual amount: ${manualAmount}`}
                        </div>
                        <button
                            onClick={handleCreateCharge}
                            disabled={loading}
                            className="px-4 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            Confirm Charge
                        </button>
                    </div>
                )}

                {/* recent charges preview */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Recent charges</h3>
                    {billingAccount && billingAccount.charges.length > 0 ? (
                        <ul className="text-sm space-y-1">
                            {billingAccount.charges
                                .slice()
                                .reverse()
                                .slice(0, 6)
                                .map((c, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span>
                                            {c.date.slice(0, 10)} — {c.code ?? "manual"} — {c.description ?? "-"}
                                        </span>
                                        <span>{c.amount.toFixed(2)}</span>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500 text-sm">No charges yet</div>
                    )}
                </div>
            </section>


            {/* Editable Lists */}
            <EditableListSection title="Medications" items={medications} setItems={setMedications} onSave={saveMedications} loading={loading} />
            <EditableListSection title="Allergies" items={allergies} setItems={setAllergies} onSave={saveAllergies} loading={loading} />
            <EditableListSection title="Medical Conditions" items={conditions} setItems={setConditions} onSave={saveConditions} loading={loading} />
            <EditableListSection title="Immunizations" items={immunizations} setItems={setImmunizations} onSave={saveImmunizations} loading={loading} />

            {/* Vitals / Labs / Encounters components (these call onSaved to refresh) */}
            <VitalsSection id={id} onSaved={fetchPatient} />
            <LabsSection id={id} onSaved={fetchPatient} />
            <EncountersSection id={id} onSaved={fetchPatient} />
        </div>
    );
}

/** EditableListSection (no single-add server call) */
function EditableListSection({
    title,
    items,
    setItems,
    onSave,
    loading,
}: {
    title: string;
    items: string[];
    setItems: (items: string[]) => void;
    onSave: () => Promise<void>;
    loading?: boolean;
}) {
    const [input, setInput] = useState("");

    const handleAdd = (): void => {
        const v = input.trim();
        if (!v) return;
        setItems([...items, v]);
        setInput("");
    };

    const handleRemove = (idx: number): void => {
        setItems(items.filter((_, i) => i !== idx));
    };

    return (
        <section className="bg-white p-4 rounded shadow mb-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium">{title}</h2>
                <button onClick={onSave} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50 text-sm">
                    Save
                </button>
            </div>

            <ul className="text-sm text-gray-700 space-y-1">
                {items.length > 0 ? (
                    items.map((m, i) => (
                        <li key={i} className="flex items-center justify-between">
                            <span>{m}</span>
                            <button onClick={() => handleRemove(i)} className="text-red-500 text-xs px-2 py-0.5 rounded hover:bg-red-50">
                                remove
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No records</li>
                )}
            </ul>

            <div className="flex gap-2 mt-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Add ${title.toLowerCase()}...`} className="border px-2 py-1 rounded flex-1" />
                <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded">
                    Add
                </button>
                <button onClick={onSave} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50">
                    Save
                </button>
            </div>
        </section>
    );
}
