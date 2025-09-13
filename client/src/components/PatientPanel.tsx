import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Users,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

interface PatientPanelProps {
  patient: PatientInfo;
  medicalConditions: MedicalCondition[];
  onConditionUpdate: (
    id: string,
    status: MedicalCondition["status"],
    details?: string
  ) => void;
}

export const PatientPanel: React.FC<PatientPanelProps> = ({
  patient,
  medicalConditions,
  onConditionUpdate,
}) => {
  const [expandedSummary, setExpandedSummary] = useState(false);

  const getStatusIcon = (status: MedicalCondition["status"]) => {
    switch (status) {
      case "confirmed":
        return <AlertTriangle className="h-4 w-4 text-medical-warning" />;
      case "denied":
        return <CheckCircle className="h-4 w-4 text-medical-success" />;
      case "partial":
        return <Clock className="h-4 w-4 text-medical-info" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getStatusBadge = (status: MedicalCondition["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-medical-warning text-medical-warning-foreground">
            Confirmed
          </Badge>
        );
      case "denied":
        return (
          <Badge className="bg-medical-success text-medical-success-foreground">
            Clear
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-medical-info text-medical-info-foreground">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const completedConditions = medicalConditions.filter(
    (c) => c.status === "confirmed" || c.status === "denied"
  ).length;
  const progressPercentage =
    (completedConditions / medicalConditions.length) * 100;

  const sessionSummary = {
    questionsAsked: 12,
    keyResponses: [
      "Confirmed Type 2 diabetes diagnosis (3 years)",
      "No current medications for diabetes",
      "Family history of hypertension",
    ],
    flaggedRisks: ["Unmanaged diabetes", "Family history consideration needed"],
    missingInfo: [
      "Blood sugar monitoring frequency",
      "Recent HbA1c levels",
      "Dietary management details",
    ],
  };

  return (
    <div className="h-full overflow-y-auto bg-medical-panel">
      {/* Patient Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{patient.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              DOB: {patient.dob}
            </p>
          </div>
        </div>
      </div>

      {/* Session Summary */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Session Summary
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedSummary(!expandedSummary)}
          >
            {expandedSummary ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Card className="p-3">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                {sessionSummary.questionsAsked}
              </div>
              <div className="text-xs text-muted-foreground">
                Questions Asked
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-medical-success">
                {completedConditions}
              </div>
              <div className="text-xs text-muted-foreground">
                Conditions Checked
              </div>
            </div>
          </div>

          {expandedSummary && (
            <>
              <Separator className="my-3" />

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Key Responses</h4>
                  <ul className="space-y-1">
                    {sessionSummary.keyResponses.map((response, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        • {response}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1 text-medical-warning">
                    Flagged Risks
                  </h4>
                  <ul className="space-y-1">
                    {sessionSummary.flaggedRisks.map((risk, index) => (
                      <li
                        key={index}
                        className="text-xs text-medical-warning flex items-center"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Missing Information
                  </h4>
                  <ul className="space-y-1">
                    {sessionSummary.missingInfo.map((info, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        • {info}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </Card>

        <Button className="w-full mt-4" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Finalize & Generate Report
        </Button>
      </div>
    </div>
  );
};
