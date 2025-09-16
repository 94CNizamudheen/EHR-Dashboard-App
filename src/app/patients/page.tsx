'use client'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import PatientCard from '../../components/PatientCard'
import { fetchPatients } from '../../lib/ehrService'
import useDebounce from '../hooks/useDebounce' 
import { useRouter } from 'next/navigation'

export default function PatientsPage() {
  const router = useRouter()
  const [q, setQ] = React.useState<string>('')
  const debounced = useDebounce<string>(q, 300)

  // Redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

  const { data: patients, isValidating } = useSWR(['patients', debounced], () => fetchPatients(debounced))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <a className="bg-indigo-600 text-white px-3 py-1 rounded" href="/patients/new">Add Patient</a>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Search by name, id or phone"
        />
      </div>

      <div className="space-y-3">
        {isValidating && !patients ? <div>Loading...</div> : patients?.map(p => <PatientCard key={p._id} patient={p} />)}
        {patients?.length === 0 && <div>No results</div>}
      </div>
    </div>
  )
}
