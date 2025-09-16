export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export type Gender = 'male' | 'female' | 'other';

export interface Patient {
  _id?: string
  firstName: string
  lastName: string
  dob: string
  gender: 'male' | 'female' | 'other'
  contact: ContactInfo
  allergies: string[]
  conditions: string[]
  medications: string[]
  immunizations: string[]
}


export type AppointmentStatus = 'scheduled' | 'rescheduled' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  dateTime: string; // ISO date-time
  status: AppointmentStatus;
  reason: string;
}

export interface User {
  name: string;
  role: 'clinician' | 'admin';
}
