// Generic FHIR Bundle
export interface FhirBundle<T> {
  resourceType: "Bundle";
  type: string;
  total?: number;
  entry?: { resource: T }[];
}

// Minimal FHIR resource types

export interface HumanName {
  family?: string;
  given?: string[];
}

export interface Patient {
  resourceType: "Patient";
  id?: string;
  name?: HumanName[];
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
}

export interface Appointment {
  resourceType: "Appointment";
  id?: string;
  status: string;
  description?: string;
  start?: string;
  end?: string;
}

export interface Observation {
  resourceType: "Observation";
  id?: string;
  status: string;
  code: { text: string };
  valueString?: string;
}

export interface Coverage {
  resourceType: "Coverage";
  id?: string;
  status: string;
  beneficiary: { reference: string };
  payor?: { display: string }[];
}
