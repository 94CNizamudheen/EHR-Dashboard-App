
"use client";

import { useEffect, useState } from "react";
import {API} from "../../../lib/api";
import type { BillingCode } from "@/types/types";

export default function BillingCodesPage() {
  const [codes, setCodes] = useState<BillingCode[]>([]);
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState<number | "">("");

  useEffect(()=>{ fetchCodes(); }, []);

  const fetchCodes = async () => {
    const res = await API.get<BillingCode[]>("/billing/codes");
    setCodes(res.data);
  };

  const handleCreate = async () => {
    if (!code || amt === "") return;
    await API.post("/billing/codes", { code, description: desc, amount: Number(amt) });
    setCode(""); setDesc(""); setAmt("");
    await fetchCodes();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Billing Codes</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-2">
          <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code" className="border px-2 py-1 rounded" />
          <input value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" className="border px-2 py-1 rounded flex-1" />
          <input value={amt} onChange={(e)=>setAmt(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount" className="border px-2 py-1 rounded w-28" />
          <button onClick={handleCreate} className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
        </div>
      </div>

      <div className="bg-white rounded shadow divide-y">
        {codes.map(c=>(
          <div key={c._id} className="px-4 py-3 flex justify-between">
            <div>
              <div className="font-medium">{c.code} — {c.description}</div>
              <div className="text-sm text-gray-500">Amount: {c.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
