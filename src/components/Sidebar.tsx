import Link from 'next/link'
import React from 'react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="text-xl font-bold mb-6">EHR</div>
      <nav className="space-y-2">
        <Link href="/" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
        <Link href="/patients" className="block p-2 rounded hover:bg-gray-100">Patients</Link>
        <Link href="/appointments" className="block p-2 rounded hover:bg-gray-100">Appointments</Link>
        <Link href="/settings" className="block p-2 rounded hover:bg-gray-100">Settings</Link>
      </nav>
    </aside>
  )
}
