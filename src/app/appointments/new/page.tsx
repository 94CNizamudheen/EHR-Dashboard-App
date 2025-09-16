
'use client'
import React, { useState } from 'react'
import { createAppointment, getAppointments } from '../../../lib/ehrService'
// import { Appointment } from '../../../types/types'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

export default function NewAppointment() {
  const [form, setForm] = useState({ patientId: '', providerId: '', dateTime: '', reason: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: appointments } = useSWR('appointments', getAppointments)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // basic conflict check: provider can't have overlapping appointment at same exact slot
    const conflict = appointments?.some(a => a.providerId === form.providerId && new Date(a.dateTime).getTime() === new Date(form.dateTime).getTime())
    if (conflict) {
      alert('Conflict: provider already has an appointment at that time')
      setLoading(false)
      return
    }
    await createAppointment({ patientId: form.patientId, providerId: form.providerId, dateTime: form.dateTime, reason: form.reason })
    setLoading(false)
    router.push('/appointments')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Book Appointment</h1>
      <form onSubmit={submit} className="bg-white rounded shadow p-4 space-y-3">
        <input required placeholder="Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} className="w-full p-2 border rounded" />
        <input required placeholder="Provider ID" value={form.providerId} onChange={e => setForm({ ...form, providerId: e.target.value })} className="w-full p-2 border rounded" />
        <input required type="datetime-local" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} className="w-full p-2 border rounded" />
        <input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="w-full p-2 border rounded" />
        <div>
          <button disabled={loading} className="bg-indigo-600 text-white px-3 py-1 rounded">Book</button>
        </div>
      </form>
    </div>
  )
}
