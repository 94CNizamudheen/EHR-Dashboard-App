'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPatientById, updatePatient } from '../../../lib/ehrService'
import { Patient } from '../../../types/types'
import PatientForm from '../../../components/PatientForm' 

interface Props {
  params: { id: string }
}

export default function PatientDetail({ params }: Props) {
  const { id } = params
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    getPatientById(id).then(p => { setPatient(p ?? null); setLoading(false) })
  }, [id])

  async function handleSave(updated: Patient) {
    setLoading(true)
    await updatePatient(id, updated)
    setLoading(false)
    router.push('/patients')
  }

  if (loading) return <div>Loading...</div>
  if (!patient) return <div>Patient not found</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{patient.firstName} {patient.lastName}</h1>
      <PatientForm patient={patient} onSave={handleSave} />
    </div>
  )
}
