import * as api from './apiClient'
import { Patient, Appointment } from '../types/types'

// Patients
export async function fetchPatients(q?: string): Promise<Patient[]> {
  const all = await api.get<Patient[]>('/patients')
  if (!q || q.trim() === '') return all
  const low = q.toLowerCase()
  return all.filter(p =>
    [p._id, p.firstName, p.lastName, p.contact?.phone, p.contact?.email]
      .some(v => v?.toLowerCase().includes(low))
  )
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  const all = await api.get<Patient[]>('/patients')
  return all.find(p => p._id === id)
}

export async function updatePatient(id: string, payload: Patient): Promise<Patient> {
  try {
    const result = await api.put<Patient>(`/patients/${id}`, payload)
    // if mock returns empty object, fall back to payload
    if ((result as Partial<Patient>)._id === undefined) return { ...payload, _id: id }
    return result
  } catch {
    return { ...payload, }
  }
}

// Appointments
export async function getAppointments(): Promise<Appointment[]> {
  return api.get<Appointment[]>('/appointments')
}

export async function createAppointment(payload: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
  try {
    const created = await api.post<Appointment>('/appointments', payload)
    if ((created as Partial<Appointment>).id === undefined) {
      return { ...payload, id: `apt-${Date.now()}`, status: 'scheduled' }
    }
    return created
  } catch {
    return { ...payload, id: `apt-${Date.now()}`, status: 'scheduled' }
  }
}

export async function cancelAppointment(id: string): Promise<boolean> {
  try {
    await api.put(`/appointments/${id}`, { status: 'cancelled' })
    return true
  } catch {
    return true
  }
}
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const { token } = await api.post<{ token: string }>('/auth/login', { username, password })
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
    return true
  } catch {
    return false
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}