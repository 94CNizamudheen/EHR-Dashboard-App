"use client";

import { useEffect, useState } from "react";
import { API } from "../../../lib/api";
import type { BillingCode } from "@/types/types";
import Loading from "@/components/Loading";

export default function BillingCodesPage() {
  const [codes, setCodes] = useState<BillingCode[]>([]);

  // create state
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState<number | "">("");
  const [createError, setCreateError] = useState<string | null>(null);

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editAmt, setEditAmt] = useState<number | "">("");
  const [editError, setEditError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true)
    try {
      const res = await API.get<BillingCode[]>("/billing/codes");
      setCodes(res.data);
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }

  };

  const handleCreate = async () => {
    setLoading(true)
    try {
      setCreateError(null);
      if (!code.trim()) return setCreateError("Code is required");
      if (amt === "" || Number(amt) <= 0)
        return setCreateError("Amount must be greater than 0");

      await API.post("/billing/codes", {
        code: code.trim(),
        description: desc.trim(),
        amount: Number(amt),
      });

      setCode("");
      setDesc("");
      setAmt("");
      await fetchCodes();
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }

  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code?")) return;
    setLoading(true)
    try {
      await API.delete(`/billing/codes/${id}`);
      await fetchCodes();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }

  };

  const handleEdit = (c: BillingCode) => {
    setEditingId(c._id!);
    setEditCode(c.code);
    setEditDesc(c.description);
    setEditAmt(c.amount);
    setEditError(null);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true)
    try {
      setEditError(null);
      if (!editCode.trim()) return setEditError("Code is required");
      if (editAmt === "" || Number(editAmt) <= 0)
        return setEditError("Amount must be greater than 0");

      await API.put(`/billing/codes/${id}`, {
        code: editCode.trim(),
        description: editDesc.trim(),
        amount: Number(editAmt),
      });

      setEditingId(null);
      await fetchCodes();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }

  };
  if(loading) return <Loading/>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold tracking-tight text-[var(--hospital-text)]">
        Billing Codes
      </h1>

      {/* Create new code form */}
      <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code"
            className="input"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="input md:col-span-2"
          />
          <input
            value={amt}
            onChange={(e) =>
              setAmt(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Amount"
            className="input"
          />
        </div>
        {createError && (
          <p className="text-red-500 text-sm mt-2">{createError}</p>
        )}
        <div className="mt-3">
          <button
            onClick={handleCreate}
            className="px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Create
          </button>
        </div>
      </div>

      {/* Codes list */}
      <div className="space-y-3">
        {codes.map((c) => (
          <div
            key={c._id}
            className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            {editingId === c._id ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="input"
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="input md:col-span-2"
                  />
                  <input
                    value={editAmt}
                    onChange={(e) =>
                      setEditAmt(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="input"
                  />
                </div>
                {editError && (
                  <p className="text-red-500 text-sm mt-2">{editError}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdate(c._id!)}
                    className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow hover:shadow-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 rounded-lg border border-[var(--hospital-border)] hover:bg-[var(--hospital-muted)]"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[var(--hospital-text)]">
                    {c.code} — {c.description}
                  </div>
                  <div className="text-sm text-[var(--hospital-subtle)]">
                    Amount: {c.amount}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-500 to-amber-400 text-[var(--hospital-bg)] shadow hover:shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id!)}
                    className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {codes.length === 0 && (
          <div className="text-center text-[var(--hospital-subtle)] py-6 border border-[var(--hospital-border)] rounded-lg bg-[var(--hospital-surface)]">
            No billing codes found
          </div>
        )}
      </div>
    </div>
  );
}
