import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Link from "next/link"

export const metadata: Metadata = {
  title: "EHR Dashboard - Healthcare Management System",
  description: "Comprehensive Electronic Health Records dashboard for healthcare providers",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside style={{ width: "220px", borderRight: "1px solid #ccc", padding: "1rem" }}>
            <h2>EHR Dashboard</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link href="/">🏠 Home</Link></li>
              <li><Link href="/patients">👤 Patients</Link></li>
              <li><Link href="/appointments">📅 Appointments</Link></li>
              <li><Link href="/clinical">🧪 Clinical</Link></li>
              <li><Link href="/billing">💳 Billing</Link></li>
              <li><Link href="/settings">⚙️ Settings</Link></li>
            </ul>
          </aside>
          <main style={{ flex: 1, padding: "1rem" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}