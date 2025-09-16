

"use client";

import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { BillingCode, Patient } from "@/types/types";

export default function NewPaymentPage() {
    const [query, setQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const [codes, setCodes] = useState<BillingCode[]>([]);
    const [selectedCode, setSelectedCode] = useState("");
    const [manualAmount, setManualAmount] = useState<number | "">("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);


    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const res = await API.get<BillingCode[]>("/billing/codes");
            setCodes(res.data);
        } catch (err) {
            console.error("Error loading codes", err);
            setCodes([]);
        }
    };

    const searchPatients = async () => {
        if (!query.trim()) return;
        try {
            setLoading(true);
            const res = await API.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
            setPatients(res.data);
        } catch (err) {
            console.error("Search failed", err);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };
    const handleAddCharge = async () => {
        if (!selectedPatient) {
            return alert("Select a patient first");
        }
        if (!selectedCode && (manualAmount === "" || Number(manualAmount) <= 0)) {
            return alert("Choose a billing code or enter an amount");
        }

        try {
            setLoading(true);

            const payload: Record<string, unknown> = {};
            if (selectedCode) payload.code = selectedCode;
            if (manualAmount !== "" && Number(manualAmount) > 0) payload.amount = Number(manualAmount);

            const res = await API.post<{ balance: number; charge: { code: string; description?: string; amount: number } }>(
                `/billing/${selectedPatient._id}/charge`,
                payload
            );

            setMessage(`Charge added: ${res.data.charge.code} (${res.data.charge.amount})`);
            setSelectedCode("");
            setManualAmount("");
        } catch (err) {
            console.error("Error adding charge", err);
            alert("Failed to add charge");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Record New Payment</h1>

            {/* search */}
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="font-medium mb-2">Search Patient</h2>
                <div className="flex gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by phone or name"
                        className="border px-3 py-2 rounded flex-1"
                    />
                    <button
                        onClick={searchPatients}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        Search
                    </button>
                </div>

                {patients.length > 0 && (
                    <ul className="mt-3 text-sm border rounded divide-y">
                        {patients.map((p) => (
                            <li
                                key={p._id}
                                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${selectedPatient?._id === p._id ? "bg-blue-100" : ""
                                    }`}
                                onClick={() => setSelectedPatient(p)}
                            >
                                {p.firstName} {p.lastName} — {p.contact?.phone ?? "—"}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* payment form */}
            {selectedPatient && (
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="font-medium mb-2">
                        Add Charge for {selectedPatient.firstName} {selectedPatient.lastName}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                placeholder="e.g. 200.00"
                                className="border px-3 py-2 rounded w-full"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleAddCharge}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        >
                            Add Charge
                        </button>
                    </div>
                </div>
            )}


            {message && (
                <div className="px-4 py-2 rounded bg-green-100 text-green-800">{message}</div>
            )}
        </div>
    );
}
