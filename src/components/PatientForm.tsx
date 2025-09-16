'use client'
import React, { useState } from 'react'
import { Patient } from '../types/types'

interface Props {
  patient: Patient
  onSave: (p: Patient) => Promise<void> | void
}

export default function PatientForm({ patient, onSave }: Props) {
  const [form, setForm] = useState<Patient>(patient)
  const [saving, setSaving] = useState(false)

  function change<K extends keyof Patient>(key: K, value: Patient[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={form.firstName} onChange={e => change('firstName', e.target.value)} className="p-2 border rounded" />
        <input value={form.lastName} onChange={e => change('lastName', e.target.value)} className="p-2 border rounded" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input value={form.dob} onChange={e => change('dob', e.target.value)} className="p-2 border rounded" />
        <select value={form.gender} onChange={e => change('gender', e.target.value as Patient['gender'])} className="p-2 border rounded">
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>
        <input value={form.contact?.phone ?? ''} onChange={e => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} className="p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Allergies (comma separated)</label>
        <input value={form.allergies.join(', ')} onChange={e => setForm({ ...form, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Conditions (comma separated)</label>
        <input value={form.conditions.join(', ')} onChange={e => setForm({ ...form, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full p-2 border rounded" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button>
      </div>
    </form>
  )
}
