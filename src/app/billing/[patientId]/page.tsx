"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {API} from "../../../lib/api";
import type { BillingAccount, PaymentRecord } from "@/types/types";

export default function BillingPatientPage() {
  const params = useParams<{ patientId: string }>();
  const patientId = params.patientId;
  const [account, setAccount] = useState<BillingAccount | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<PaymentRecord["method"]>("cash");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!patientId) return;
    fetchAccount();
  }, [patientId]);

  const fetchAccount = async () => {
    const res = await API.get<BillingAccount>(`/billing/account/${patientId}`);
    setAccount(res.data);
  };

  const handleAddPayment = async () => {
    if (!patientId || amount === "" || Number(amount) <= 0) return;
    await API.post(`/billing/${patientId}/payment`, { amount: Number(amount), method, note });
    setAmount("");
    setNote("");
    await fetchAccount();
  };

  const handleAddCharge = async () => {
    const code = prompt("Enter code (optional)");
    const description = prompt("Enter description (optional)") || undefined;
    const amtStr = prompt("Amount (numeric)");
    if (!amtStr) return;
    const amt = Number(amtStr);
    if (isNaN(amt) || amt <= 0) return alert("Invalid amount");
    await API.post(`/billing/${patientId}/charge`, { code, description, amount: amt });
    await fetchAccount();
  };

  if (!account) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Billing for patient {patientId}</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-medium">Balance: {account.balance}</h2>
        <button onClick={handleAddCharge} className="px-3 py-1 mt-2 bg-yellow-500 text-white rounded">Add Charge</button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-medium">Make Payment</h3>
        <div className="flex gap-2 mt-2">
          <input value={amount} onChange={(e)=>setAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount" className="border px-2 py-1 rounded" />
          <select value={method} onChange={(e)=>setMethod(e.target.value as PaymentRecord["method"])} className="border px-2 py-1 rounded">
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="insurance">Insurance</option>
            <option value="other">Other</option>
          </select>
          <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note" className="border px-2 py-1 rounded flex-1" />
          <button onClick={handleAddPayment} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-medium">Payments</h3>
        <ul className="text-sm space-y-1">
          {account.payments.map((p)=>(
            <li key={p._id}>{p.date} — {p.method} — {p.amount} {p.note ? `(${p.note})` : ""}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-medium">Charges</h3>
        <ul className="text-sm space-y-1">
          {account.charges.map((c, idx)=>(
            <li key={idx}>{c.date} — {c.code} — {c.description || "-"} — {c.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
