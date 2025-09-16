import Link from 'next/link'
import React from 'react'
import { Patient } from '../types/types'

interface Props { patient: Patient }

export default function PatientCard({ patient }: Props) {
  return (
    <div className="p-3 border rounded bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{patient.firstName} {patient.lastName}</div>
          <div className="text-sm text-gray-500">{patient._id}</div>
        </div>
        <div className="space-x-2">
          <Link href={`/patients/${patient._id}`} className="text-indigo-600">Open</Link>
        </div>
      </div>
    </div>
  )
}
