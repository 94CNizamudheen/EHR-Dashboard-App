
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export type Gender = "male" | "female" | "other";

export type ClinicalNote = {
  text: string;
  author: string;
  date: string;
};

export type VitalSigns = {
  bp?: string;
  hr?: string;
  temp?: string;
  weight?: string;
  date: string;
};

export type LabResult = {
  testName: string;
  result: string;
  unit?: string;
  normalRange?: string;
  date: string;
};

export type Encounter = {
  diagnosis?: string;
  procedure?: string;
  notes?: string;
  provider?: string;
  date: string; 
  
};
export type Patient = {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "male" | "female" | "other";
  contact: ContactInfo;
  allergies: string[];
  conditions: string[];
  medications: string[];
  immunizations: string[];
  notes: ClinicalNote[];
  vitals: VitalSigns[];
  labs: LabResult[];
  encounters: Encounter[];
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

export type BillingCode = {
  _id?: string;
  code: string;           
  description: string;
  amount: number;        
  active?: boolean;
};
export type PaymentMethod="cash" | "card" | "insurance" | "other"
export type PaymentRecord = {
  _id?: string;
  patientId: string;
  amount: number;
  method: PaymentMethod;
  date: string;           
  note?: string;
};

export type BillingAccount = {
  _id?: string;
  patientId: string;
  balance: number;      
  charges: { code: string; description?: string; amount: number; date: string }[];
  payments: PaymentRecord[];
};
export type ReportSummary = {
  totalRevenue: number;
  totalOutstanding: number;
  accountsCount?: number;
};

export type Charge = {
  code?: string;
  description?: string;
  amount: number;
  date: string;
};
