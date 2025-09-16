'use client'
import React from 'react'
import useSWR from 'swr'
import { getAppointments } from '../../lib/ehrService'
import Link from 'next/link'

export default function AppointmentsPage() {
  const { data } = useSWR('appointments', getAppointments)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <Link href="/appointments/new" className="bg-indigo-600 text-white px-3 py-1 rounded">Book Appointment</Link>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th>When</th>
              <th>Patient</th>
              <th>Provider</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(a => (
              <tr key={a.id} className="border-t">
                <td className="py-2">{new Date(a.dateTime).toLocaleString()}</td>
                <td className="py-2">{a.patientId}</td>
                <td className="py-2">{a.providerId}</td>
                <td className="py-2">{a.reason}</td>
                <td className="py-2">{a.status}</td>
              </tr>
            )) ?? <tr><td>Loading...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
