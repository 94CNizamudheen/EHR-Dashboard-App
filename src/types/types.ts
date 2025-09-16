
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export type Gender = "male" | "female" | "other";

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  contact: ContactInfo;
  allergies: string[];
  conditions: string[];
  medications: string[];
  immunizations: string[];
  notes: Record<string, unknown>[];   
  vitals: Record<string, unknown>[];
  labs: Record<string, unknown>[];
  encounters: Record<string, unknown>[];
}
export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type Appointment = {
  _id: string;
  patient: Patient ; 
  provider: string;
  date: string; 
  time: string;
  reason?: string;
  status: AppointmentStatus;
};