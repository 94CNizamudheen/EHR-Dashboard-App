"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItemProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export default function Sidebar() {
  const path = usePathname() ?? "/";

  const nav: NavItemProps[] = [
    { href: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { href: "/patients", label: "Patient Management", icon: <PatientIcon /> },
    { href: "/appointments", label: "Appointments", icon: <CalendarIcon /> },
    { href: "/clinical", label: "Clinical", icon: <StethIcon /> },
    { href: "/billing", label: "Billing", icon: <BillIcon /> },
  ];

  return (
    <aside
      aria-label="Main navigation"
      className="hidden md:block w-[260px] h-screen fixed top-16 left-0 p-6"
      style={{
        background: "linear-gradient(180deg, var(--hospital-surface), rgba(8,20,35,0.6))",
        borderRight: "1px solid var(--hospital-border)",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(90deg,var(--hospital-primary), var(--hospital-accent))" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2v20M2 12h20" stroke="#041726" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold">EHR Dashboard</div>
              <div className="text-xs text-[var(--hospital-subtle)] mt-0.5">Hospital Edition</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1" role="navigation">
          {nav.map((n) => {
            const active = path === n.href || path?.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm 
                  ${active ? "bg-[linear-gradient(90deg,var(--hospital-primary)_0%,rgba(6,182,212,0.08)_100%)]" : "hover:bg-[var(--hospital-muted)]"}
                `}
                aria-current={active ? "page" : undefined}
                style={{ color: active ? "var(--hospital-primary)" : "var(--hospital-text)" }}
              >
                <span className="w-5 h-5 flex items-center justify-center text-[var(--hospital-text)]">{n.icon}</span>
                <span className="flex-1">{n.label}</span>
                {active && <span className="text-xs text-[var(--hospital-subtle)]">●</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto text-xs text-[var(--hospital-subtle)]">
          <div>Version 0.1</div>
          <div className="mt-2">© Hospital Inc</div>
        </div>
      </div>
    </aside>
  );
}

/* Inline icons (no explicit return types) */
function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="13" y="3" width="8" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="13" y="10.5" width="8" height="10.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="3" y="13" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PatientIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 20c1.5-4.5 6-6 7-6s5.5 1.5 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 11h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StethIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 13v3a3 3 0 11-6 0v-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 6v4a6 6 0 0012 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="17" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function BillIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7h8M8 11h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
