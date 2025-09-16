"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">EHR Dashboard</h1>
      <nav className="space-y-2">
        <NavItem href="/">Dashboard</NavItem>
        <NavItem href="/patients">Patient Management</NavItem>
        <NavItem href="/appointments">Appointments</NavItem>
        <NavItem href="/clinical">Clinical</NavItem>
        <NavItem href="/billing">Billing</NavItem>
      </nav>
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-md px-3 py-2 hover:bg-gray-100">
      {children}
    </Link>
  );
}
