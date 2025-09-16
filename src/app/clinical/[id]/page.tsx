"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "../../../lib/api";
import type { ClinicalNote, Patient } from "@/types/types";
import VitalsSection from "@/components/VitalSection";
import LabsSection from "@/components/LabSection";
import EncountersSection from "@/components/EncountersSection";

export default function ClinicalDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;

    const [patient, setPatient] = useState<Patient | null>(null);

    const [note, setNote] = useState("");
    const [medications, setMedications] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const [immunizations, setImmunizations] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchPatient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function fetchPatient() {
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

    function showSaved(msg: string) {
        setSavedMessage(msg);
        setTimeout(() => setSavedMessage(null), 2500);
    }

    const addNote = async () => {
        if (!id || !note.trim()) return;
        try {
            setLoading(true);
            await API.post(`/clinical/${id}/notes`, { text: note, author: "Dr. Admin" });
            setNote("");
            await fetchPatient();
            showSaved("Note saved");
        } catch (err) {
            console.error("Error adding note", err);
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
        } finally {
            setLoading(false);
        }
    };

    const saveAllergies = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const res = await API.put(`/clinical/${id}/allergies`, { allergies });
            console.log(res)
            await fetchPatient();
            showSaved("Allergies saved");
        } catch (err) {
            console.error("Error saving allergies", err);
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
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">
                    Clinical Records: {patient.firstName} {patient.lastName}
                </h1>

                <div className="flex items-center gap-3">
                    {savedMessage && (
                        <div className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm">
                            {savedMessage}
                        </div>
                    )}
                    <button
                        onClick={handleComplete}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Complete
                    </button>
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
                    <button
                        onClick={addNote}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </section>

            {/* Editable Lists */}
            <EditableListSection
                title="Medications"
                items={medications}
                setItems={setMedications}
                onSave={saveMedications}
                loading={loading}
            />

            <EditableListSection
                title="Allergies"
                items={allergies}
                setItems={setAllergies}
                onSave={saveAllergies}
                loading={loading}
            />

            <EditableListSection
                title="Medical Conditions"
                items={conditions}
                setItems={setConditions}
                onSave={saveConditions}
                loading={loading}
            />

            <EditableListSection
                title="Immunizations"
                items={immunizations}
                setItems={setImmunizations}
                onSave={saveImmunizations}
                loading={loading}
            />
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

    const handleAdd = () => {
        const v = input.trim();
        if (!v) return;
        setItems([...items, v]);
        setInput("");
    };

    const handleRemove = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    return (
        <section className="bg-white p-4 rounded shadow mb-4">


            <ul className="text-sm text-gray-700 space-y-1">
                {items.length > 0 ? (
                    items.map((m, i) => (
                        <li key={i} className="flex items-center justify-between">
                            <span>{m}</span>
                            <button
                                onClick={() => handleRemove(i)}
                                className="text-red-500 text-xs px-2 py-0.5 rounded hover:bg-red-50"
                            >
                                remove
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No records</li>
                )}
            </ul>

            <div className="flex gap-2 mt-3">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Add ${title.toLowerCase()}...`}
                    className="border px-2 py-1 rounded flex-1"
                />
                <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded">
                    Add
                </button>
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                >
                    Save
                </button>
            </div>
        </section>
    );
}
