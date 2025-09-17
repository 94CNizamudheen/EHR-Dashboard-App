"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { API } from "@/lib/api";
import type { Patient, Appointment, BillingAccount, ReportSummary, Charge } from "@/types/types";



export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [accounts, setAccounts] = useState<BillingAccount[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [nowLocal, setNowLocal] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setNowLocal(new Date().toLocaleString());
  }, []);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pRes, aRes, sRes, accRes] = await Promise.allSettled([
          API.get<Patient[]>("/patients"),
          API.get<Appointment[]>("/appointments"),
          API.get<ReportSummary>("/billing/reports/summary"),
          API.get<BillingAccount[]>("/billing/accounts"),
        ]);

        if (!mounted) return;

        if (pRes.status === "fulfilled") setPatients(pRes.value.data);
        else setPatients([]);

        if (aRes.status === "fulfilled") setAppointments(aRes.value.data);
        else setAppointments([]);

        if (sRes.status === "fulfilled") setSummary(sRes.value.data);
        else setSummary(null);

        if (accRes.status === "fulfilled") setAccounts(accRes.value.data);
        else setAccounts(null);
      } catch (err) {
        console.error("Dashboard load error", err);
        setError("Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  function toISODate(d: string | Date): string {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  const patientCount = patients.length;
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(now.getDate() + 7);
    return appointments.filter((a) => {

      try {
        const dt = new Date(a.date);
        return dt >= now && dt <= weekLater && a.status !== "cancelled";
      } catch {
        return false;
      }
    }).length;
  }, [appointments]);

  const revenue = summary?.totalRevenue ?? 0;
  const outstanding = summary?.totalOutstanding ?? 0;

  const appointmentsByDay = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    const today = new Date();
    // build last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({ date: toISODate(d), count: 0 });
    }

    const map = new Map(days.map((d) => [d.date, 0]));
    for (const a of appointments) {
      try {
        const dt = new Date(a.date);
        const key = toISODate(dt);
        if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
      } catch {

      }
    }

    return days.map((d) => ({ date: d.date, count: map.get(d.date) ?? 0 }));
  }, [appointments]);
  const recentAppointments = useMemo(() => {
    const copy = [...appointments];
    copy.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return db - da;
    });
    return copy.slice(0, 6);
  }, [appointments]);

  const recentCharges = useMemo(() => {
    if (!accounts || accounts.length === 0) return [] as Charge[];

    const all: Charge[] = [];
    for (const acct of accounts) {
      for (const c of acct.charges ?? []) {
        all.push({ code: c.code, description: c.description, amount: c.amount, date: c.date });
      }
    }
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return all.slice(0, 6);
  }, [accounts]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Welcome to EHR Dashboard</h1>
        <div className="text-sm text-[var(--hospital-subtle)]">
          {loading ? "Loading..." : (mounted ? nowLocal : "—")}
        </div>
      </div>

      {error && <div className="mb-4 text-red-400">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <OverviewCard title="Patients" value={patientCount.toString()} subtitle="Total registered patients" link="/patients" />
        <OverviewCard title="Upcoming Appts" value={upcomingAppointments.toString()} subtitle="Next 7 days" link="/appointments" />
        <OverviewCard title="Revenue" value={formatMoney(revenue)} subtitle="Total revenue" link="/billing" />
        <OverviewCard title="Outstanding" value={formatMoney(outstanding)} subtitle="Total outstanding" link="/billing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Appointments (last 7 days)</h2>
              <Link href="/appointments" className="text-sm text-[var(--hospital-primary)]">View all</Link>
            </div>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentsByDay} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(6,182,212,0.9)" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="rgba(6,182,212,0.1)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="var(--hospital-subtle)" />
                  <YAxis stroke="var(--hospital-subtle)" allowDecimals={false} />
                  <Tooltip formatter={(value: number) => `${value} appt(s)`} />
                  <Area type="monotone" dataKey="count" stroke="var(--hospital-primary)" fill="url(#colorAppt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Recent Appointments</h2>
              <Link href="/appointments" className="text-sm text-[var(--hospital-primary)]">View all</Link>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-sm text-[var(--hospital-subtle)]">No recent appointments</div>
            ) : (
              <ul className="divide-y">
                {recentAppointments.map((a) => (
                  <li key={String(a._id)} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{formatApptLabel(a)}</div>
                      <div className="text-xs text-[var(--hospital-subtle)]">{a.provider} • {a.status}</div>
                    </div>
                    <div className="text-sm text-[var(--hospital-subtle)]">{shortDateTime(a.date, a.time)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: billing snapshot */}
        <div className="space-y-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Billing Summary</h2>
              <Link href="/billing" className="text-sm text-[var(--hospital-primary)]">Open Billing</Link>
            </div>

            <div className="text-sm text-[var(--hospital-subtle)] mb-3">Revenue / Outstanding</div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--hospital-muted)] rounded w-1/2">
                <div className="text-xs text-[var(--hospital-subtle)]">Revenue</div>
                <div className="text-lg font-semibold">{formatMoney(revenue)}</div>
              </div>
              <div className="p-3 bg-[var(--hospital-muted)] rounded w-1/2">
                <div className="text-xs text-[var(--hospital-subtle)]">Outstanding</div>
                <div className="text-lg font-semibold">{formatMoney(outstanding)}</div>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <div>Total accounts: <strong>{summary?.accountsCount ?? accounts?.length ?? "-"}</strong></div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Recent Charges</h2>
              <Link href="/billing" className="text-sm text-[var(--hospital-primary)]">All charges</Link>
            </div>

            {recentCharges.length === 0 ? (
              <div className="text-sm text-[var(--hospital-subtle)]">No charges available</div>
            ) : (
              <ul className="text-sm divide-y">
                {recentCharges.map((c, idx) => (
                  <li key={`${c.code ?? "manual"}-${idx}`} className="py-2 flex justify-between">
                    <div>
                      <div>{c.description ?? c.code ?? "Manual charge"}</div>
                      <div className="text-xs text-[var(--hospital-subtle)]">{c.code ?? "-"}</div>
                    </div>
                    <div className="text-sm">{formatMoney(c.amount)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ title, value, subtitle, link }: { title: string; value: string; subtitle: string; link?: string }) {
  return (
    <Link href={link ?? "#"} className="block p-4 rounded-lg border hover:shadow card">
      <div className="text-xs text-[var(--hospital-subtle)]">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-[var(--hospital-subtle)]">{subtitle}</div>
    </Link>
  );
}

function formatMoney(v: number): string {
  return `₹${v.toFixed(2)}`;
}

function formatApptLabel(a: Appointment): string {
  const patientLabel = typeof a.patient === "string" ? a.patient : `${a.patient?.firstName ?? ""} ${a.patient?.lastName ?? ""}`.trim();
  return `${patientLabel || "Unknown patient"} — ${a.date}`;
}

function shortDateTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const datePart = d.toLocaleDateString();
  if (timeStr) return `${datePart} ${timeStr}`;
  const t = dateStr.includes("T") ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  return `${datePart} ${t}`;
}
