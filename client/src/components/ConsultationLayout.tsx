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

  const [patient] = useState<PatientInfo>({
    name: "Rajesh Kumar",
    policyId: "ACK2024001234",
    dob: "15/03/1985",
    members: [
      { name: "Rajesh Kumar", relation: "Self", dob: "15/03/1985" },
      { name: "Priya Kumar", relation: "Wife", dob: "22/07/1988" },
      { name: "Arjun Kumar", relation: "Son", dob: "10/05/2015" },
    ],
  });

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
      <ConsultationHeader
        patientName={patient.name}
        policyId={patient.policyId}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Video Consultation */}
        <div className="w-[30%] border-r border-border">
          <VideoPanel
            isCallActive={isCallActive}
            isMuted={isMuted}
            currentLanguage={currentLanguage}
            onToggleMute={() => setIsMuted(!isMuted)}
            onEndCall={() => setIsCallActive(false)}
            onLanguageChange={setCurrentLanguage}
          />
        </div>

        {/* Center Panel - Transcription & AI */}
        <div className="w-[45%] border-r border-border">
          <TranscriptionPanel
            currentLanguage={currentLanguage}
            onConditionUpdate={updateConditionStatus}
          />
        </div>

        {/* Right Panel - Patient Info */}
        <div className="w-[25%]">
          <PatientPanel
            patient={patient}
            medicalConditions={medicalConditions}
            onConditionUpdate={updateConditionStatus}
          />
        </div>
      </div>
    </div>
  );
};
