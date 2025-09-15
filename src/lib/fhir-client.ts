/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "./api-client";

/* Patients */
export const FHIR = {
  patients: {
    list: (t: string) => apiRequest("Patient", t),
    get: (t: string, id: string) => apiRequest(`Patient/${id}`, t),
    create: (t: string, data: any) =>
      apiRequest("Patient", t, { method: "POST", body: JSON.stringify(data) }),
    update: (t: string, id: string, data: any) =>
      apiRequest(`Patient/${id}`, t, { method: "PUT", body: JSON.stringify(data) }),
    delete: (t: string, id: string) =>
      apiRequest(`Patient/${id}`, t, { method: "DELETE" }),
  },
  appointments: {
    list: (t: string) => apiRequest("Appointment", t),
    create: (t: string, data: any) =>
      apiRequest("Appointment", t, { method: "POST", body: JSON.stringify(data) }),
    update: (t: string, id: string, data: any) =>
      apiRequest(`Appointment/${id}`, t, { method: "PUT", body: JSON.stringify(data) }),
    delete: (t: string, id: string) =>
      apiRequest(`Appointment/${id}`, t, { method: "DELETE" }),
  },
  observations: {
    list: (t: string) => apiRequest("Observation", t),
    create: (t: string, data: any) =>
      apiRequest("Observation", t, { method: "POST", body: JSON.stringify(data) }),
    update: (t: string, id: string, data: any) =>
      apiRequest(`Observation/${id}`, t, { method: "PUT", body: JSON.stringify(data) }),
    delete: (t: string, id: string) =>
      apiRequest(`Observation/${id}`, t, { method: "DELETE" }),
  },
  coverage: {
    list: (t: string) => apiRequest("Coverage", t),
    create: (t: string, data: any) =>
      apiRequest("Coverage", t, { method: "POST", body: JSON.stringify(data) }),
    update: (t: string, id: string, data: any) =>
      apiRequest(`Coverage/${id}`, t, { method: "PUT", body: JSON.stringify(data) }),
    delete: (t: string, id: string) =>
      apiRequest(`Coverage/${id}`, t, { method: "DELETE" }),
  },
};
