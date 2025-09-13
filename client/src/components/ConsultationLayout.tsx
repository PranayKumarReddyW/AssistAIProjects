import React, { useState, useEffect } from "react";
import {
  getConsultations,
  createConsultation,
  getTranscriptions,
  createTranscription,
} from "../lib/api";
import { ConsultationHeader } from "./ConsultationHeader";
import { VideoPanel } from "./VideoPanel";
import { TranscriptionPanel } from "./TranscriptionPanel";
import { PatientPanel } from "./PatientPanel";
import ChatPanel from "./ChatPanel";

interface PatientInfo {
  name: string;
  policyId: string;
  dob?: string;
  members?: Array<{
    name: string;
    relation: string;
    dob: string;
    height?: string;
    weight?: string;
  }>;
}

interface MedicalCondition {
  id: string;
  name: string;
  status: "unchecked" | "confirmed" | "denied" | "partial";
  details?: string;
  followUpNeeded?: boolean;
}

export const ConsultationLayout: React.FC = () => {
  const token = localStorage.getItem("accessToken") || "YOUR_ACCESS_TOKEN_HERE";
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [peerId, setPeerId] = useState<string>("");
  // Fetch logged-in user info and patient details
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        // Get logged-in user info
        const user = await import("../lib/api").then((m) => m.getMe(token));
        setUserId(user.id || user._id || user.name || "");
        let patientData;
        // If user is a patient and has patient details, use them
        if (user.role === "patient" && user.patient) {
          patientData = {
            name: user.patient.name || user.name,
            policyId: user.patient.insurancePolicyNumber || "N/A",
            dob: user.patient.dob
              ? new Date(user.patient.dob).toLocaleDateString()
              : "N/A",
            members: user.patient.members || [],
          };
        } else {
          // Fallback to user info
          patientData = {
            name: user.name,
            policyId: user.policyId || "N/A",
            dob: user.dob || "N/A",
            members: user.members || [],
          };
        }
        setPatient(patientData);
      } catch (err) {
        setPatient(null);
      }
      setLoadingPatient(false);
    };
    fetchPatientInfo();
  }, [token]);

  const [medicalConditions, setMedicalConditions] = useState<
    MedicalCondition[]
  >([
    { id: "diabetes", name: "Diabetes", status: "unchecked" },
    { id: "hypertension", name: "High Blood Pressure", status: "unchecked" },
    { id: "heart", name: "Heart Disease", status: "unchecked" },
    { id: "kidney", name: "Kidney Disease", status: "unchecked" },
    { id: "liver", name: "Liver Disease", status: "unchecked" },
    { id: "cancer", name: "Cancer", status: "unchecked" },
    { id: "mental", name: "Mental Health", status: "unchecked" },
    { id: "respiratory", name: "Respiratory Issues", status: "unchecked" },
  ]);

  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");

  // Fetch consultations on mount
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const patientId = "some-patient-id";
        const consultations = await getConsultations(patientId, token);
        // TODO: Set consultations in state if needed
        console.log("Fetched consultations:", consultations);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      }
    };

    fetchConsultations();
  }, [token]);

  const handleCreateConsultation = async () => {
    try {
      const patientId = "some-patient-id";
      const doctorId = "some-doctor-id";
      const notes = "Consultation notes here.";
      const date = new Date().toISOString().split("T")[0];
      await createConsultation({ patientId, doctorId, notes, date }, token);
      // Optionally refetch consultations
    } catch (error) {
      console.error("Error creating consultation:", error);
    }
  };

  const handleFetchTranscriptions = async (consultationId: string) => {
    try {
      const transcriptions = await getTranscriptions(consultationId, token);
      console.log("Fetched transcriptions:", transcriptions);
    } catch (error) {
      console.error("Error fetching transcriptions:", error);
    }
  };

  const handleCreateTranscription = async (
    consultationId: string,
    text: string
  ) => {
    try {
      await createTranscription({ consultationId, text }, token);
      // Optionally refetch transcriptions
    } catch (error) {
      console.error("Error creating transcription:", error);
    }
  };

  const updateConditionStatus = (
    id: string,
    status: MedicalCondition["status"],
    details?: string
  ) => {
    setMedicalConditions((prev) =>
      prev.map((condition) =>
        condition.id === id
          ? {
              ...condition,
              status,
              details,
              followUpNeeded: status === "confirmed",
            }
          : condition
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {loadingPatient ? (
        <div className="flex items-center justify-center h-full">
          Loading patient info...
        </div>
      ) : patient ? (
        <>
          <ConsultationHeader
            patientName={patient.name}
            policyId={patient.policyId}
          />
          <div className="flex-1 flex overflow-hidden">
            {/* Center Panel - Transcription & AI */}
            <div className="w-[70%] border-r border-border">
              <TranscriptionPanel
                currentLanguage={currentLanguage}
                onConditionUpdate={updateConditionStatus}
              />
              {/* Add ChatPanel below transcription for demo */}
              <div className="mt-4">
                <div className="mb-2 flex gap-2 items-center">
                  <label htmlFor="peerIdInput" className="text-sm">
                    Chat with user:
                  </label>
                  <input
                    id="peerIdInput"
                    type="text"
                    value={peerId}
                    onChange={(e) => setPeerId(e.target.value)}
                    placeholder="Enter peer userId"
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
                {userId && peerId && (
                  <ChatPanel userId={userId} peerId={peerId} />
                )}
              </div>
            </div>
            {/* Right Panel - Patient Info */}
            <div className="w-[30%]">
              <PatientPanel
                patient={patient}
                medicalConditions={medicalConditions}
                onConditionUpdate={updateConditionStatus}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-red-500">
          Failed to load patient info.
        </div>
      )}
    </div>
  );
};
