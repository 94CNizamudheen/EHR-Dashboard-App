'use client'
import useSWR from 'swr'
import { getAppointments, fetchPatients } from '../lib/ehrService'
import PatientCard from '../components/PatientCard' 
import Link from 'next/link'
import React from 'react'

export default function Page() {
  const { data: patients } = useSWR('patients-summary', () => fetchPatients())
  const { data: apts } = useSWR('appointments', getAppointments)

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">EHR Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-medium mb-2">Upcoming Appointments</h2>
            <ul>
              {apts?.slice(0, 6).map(a => (
                <li key={a.id} className="py-2 border-b">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{a.reason}</div>
                      <div className="text-sm text-gray-500">{new Date(a.dateTime).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-gray-600">Status: {a.status}</div>
                  </div>
                </li>
              )) ?? <li>Loading appointments...</li>}
            </ul>
            <div className="mt-3">
              <Link href="/appointments" className="text-indigo-600">View all appointments →</Link>
            </div>
          </section>
        </div>

        <div>
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-medium mb-2">Patients</h2>
            <div className="space-y-2">
              {patients?.slice(0, 5).map(p => <PatientCard key={p._id} patient={p} />) ?? <div>Loading patients...</div>}
            </div>
            <div className="mt-3">
              <Link href="/patients" className="text-indigo-600">Manage patients →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
