// Consultations API
export const getConsultations = async (patientId, token) => {
  const API_BASE = "http://localhost:9000/api";
  const url = patientId
    ? `${API_BASE}/consultations?patientId=${patientId}`
    : `${API_BASE}/consultations`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const createConsultation = async (consultation, token) => {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/consultations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(consultation),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// Transcriptions API
export const getTranscriptions = async (consultationId, token) => {
  const API_BASE = "http://localhost:9000/api";
  const url = consultationId
    ? `${API_BASE}/transcription?consultationId=${consultationId}`
    : `${API_BASE}/transcription`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const createTranscription = async (transcription, token) => {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/transcription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(transcription),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};
// Update Appointment API function
export async function updateAppointment(appointmentId, updateData, token) {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
// Signup API function
export async function signup({ name, email, password }) {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
// ...existing code...

// ...existing code...

// Utility: Merge headers correctly in fetch wrapper
function mergeHeaders(defaultHeaders, customHeaders) {
  return { ...defaultHeaders, ...(customHeaders || {}) };
}

// If you want to use the new fetch wrapper, update your existing functions like this:
// Example:
// async function apiFetch(url, options = {}) {
//   const headers = mergeHeaders({ "Content-Type": "application/json" }, options.headers);
//   const res = await fetch(url, { ...options, headers });
//   const data = await res.json();
//   if (!res.ok) throw data;
//   return data;
// }

// You can now update your existing exported functions to use this pattern if needed.
import axios from "axios";

const API_URL = "http://localhost:9000/api";

// Patient APIs
export const getPatients = async (token, params = {}) => {
  const res = await axios.get(`${API_URL}/patients`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
};

export const createPatient = async (data, token) => {
  const res = await axios.post(`${API_URL}/patients`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Auth APIs
export const register = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res.data;
};

export const getMe = async (token) => {
  const res = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  return res.data;
};

export const logout = async (token) => {
  const res = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// User APIs
export const getUsers = async (token) => {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const getUserById = async (id, token) => {
  const res = await axios.get(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (id, token) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createAppointment = async (data, token) => {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

export const getAppointments = async (token, params = {}) => {
  const API_BASE = "http://localhost:9000/api";
  const query =
    params && Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";
  const res = await fetch(`${API_BASE}/appointments${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

export const getAppointmentById = async (id, token) => {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

export const deleteAppointment = async (id, token) => {
  const API_BASE = "http://localhost:9000/api";
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

// Report APIs
export const createReport = async (data, token) => {
  const res = await axios.post(`${API_URL}/reports`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getReports = async (token, params = {}) => {
  const res = await axios.get(`${API_URL}/reports`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
};

export const getReportById = async (id, token) => {
  const res = await axios.get(`${API_URL}/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateReport = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/reports/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteReport = async (id, token) => {
  const res = await axios.delete(`${API_URL}/reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getTranscriptionById = async (id, token) => {
  const res = await axios.get(`${API_URL}/transcription/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Settings APIs
export const getSettings = async (token) => {
  const res = await axios.get(`${API_URL}/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateSettings = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/settings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Notification APIs
export const createNotification = async (data, token) => {
  const res = await axios.post(`${API_URL}/notifications`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getNotifications = async (token) => {
  const res = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateNotification = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/notifications/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteNotification = async (id, token) => {
  const res = await axios.delete(`${API_URL}/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// --- Types for API responses (based on your examples) ---
export interface Consultation {
  _id: string;
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Report {
  _id: string;
  id: string;
  patientId: string;
  doctorId: string;
  consultationId: string;
  type: string;
  findings: string[];
  recommendations: string[];
  status: string;
  riskLevel: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Transcription {
  _id: string;
  id: string;
  consultationId: string;
  fileUrl: string;
  result?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Settings {
  _id: string;
  id: string;
  userId: string;
  preferences: {
    theme: string;
    language: string;
  };
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointmentReminders: boolean;
    reportAlerts: boolean;
    systemUpdates: boolean;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Notification {
  _id: string;
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// --- End of file ---
