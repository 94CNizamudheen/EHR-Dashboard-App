"use client";

import { useEffect, useState } from "react";
import { API } from "../../lib/api";
import Link from "next/link";
import type { Patient } from "@/types/types";

interface OutstandingPatient {
  patient: Patient;
  balance: number;
}

export default function BillingOverview() {
  const [summary, setSummary] = useState<{
    totalRevenue: number;
    totalOutstanding: number;
  } | null>(null);

  const [outstanding, setOutstanding] = useState<OutstandingPatient[]>([]);

  useEffect(() => {
    fetchSummary();
    fetchOutstanding();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await API.get("/billing/reports/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOutstanding = async () => {
    try {
      const res = await API.get<OutstandingPatient[]>("/billing/reports/outstanding");
      setOutstanding(res.data);
    } catch (err) {
      console.error("Error fetching outstanding patients", err);
      setOutstanding([]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--hospital-text)]">
          Billing & Administrative
        </h1>
        <Link
          href="/billing/codes"
          className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[var(--hospital-primary)] to-cyan-500 text-[var(--hospital-bg)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          Billing Codes
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg">
          <h3 className="font-semibold text-lg mb-3">Summary</h3>
          <p className="text-[var(--hospital-text)]">
            Total revenue:{" "}
            <span className="font-semibold text-green-400">
              {summary ? summary.totalRevenue.toFixed(2) : "—"}
            </span>
          </p>
          <p className="text-[var(--hospital-text)] mt-1">
            Total outstanding:{" "}
            <span className="font-semibold text-red-400">
              {summary ? summary.totalOutstanding.toFixed(2) : "—"}
            </span>
          </p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg">
          <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/billing/new-record"
                className="block px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Record new Payment
              </Link>
            </li>
            <li>
              <Link
                href="/billing/new-action"
                className="block px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-400 text-[var(--hospital-bg)] text-center shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Pay / Action Payment
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Outstanding Patients */}
      <div className="bg-[var(--hospital-surface)] border border-[var(--hospital-border)] p-5 rounded-xl shadow-lg">
        <h3 className="font-semibold text-lg mb-3">Outstanding Patients</h3>
        {outstanding.length > 0 ? (
          <ul className="divide-y divide-[var(--hospital-border)] text-sm">
            {outstanding.map((o) => (
              <li
                key={o.patient._id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <Link
                    href={`/clinical/${o.patient._id}`}
                    className="hover:underline text-[var(--hospital-text)]"
                  >
                    {o.patient.firstName} {o.patient.lastName}
                  </Link>
                  <div className="text-xs text-[var(--hospital-subtle)]">
                    {o.patient.contact?.phone ?? "—"}
                  </div>
                </div>
                <span className="font-semibold text-red-400">
                  {o.balance.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--hospital-subtle)] text-sm">
            No outstanding balances 🎉
          </p>
        )}
      </div>
    </div>
  );
}
