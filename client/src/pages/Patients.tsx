import React, { useState, useEffect } from "react";
import { getPatients, createPatient } from "../lib/api"; // If this fails, try import * as api from '../lib/api'; and use api.getPatients
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  policyId: string;
  dob: string;
  address: string;
  lastConsultation: string;
  riskLevel: "low" | "medium" | "high";
  conditions: string[];
  status: "active" | "inactive" | "pending";
}

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, filterRisk]);

  const token = localStorage.getItem("accessToken") || "YOUR_ACCESS_TOKEN_HERE";

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = { search: searchTerm, risk: filterRisk };
      const data = await getPatients(token, params);
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
    setLoading(false);
  };

  const createNewPatient = async (patientData: Partial<Patient>) => {
    try {
      await createPatient(patientData, token);
      fetchPatients();
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return (
          <Badge className="bg-medical-critical text-medical-critical-foreground">
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-medical-warning text-medical-warning-foreground">
            Medium Risk
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-medical-success text-medical-success-foreground">
            Low Risk
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-medical-success" />;
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-medical-warning" />;
      default:
        return <Heart className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.policyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk =
      filterRisk === "all" || patient.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and medical histories
          </p>
        </div>
        <Button size="lg" onClick={() => createNewPatient({})}>
          <Plus className="h-5 w-5 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or policy ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-input bg-background"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Patients List */}
      <div className="grid gap-4">
        {loading ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Loading patients...
            </div>
          </Card>
        ) : filteredPatients.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              No patients found
            </div>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Patient Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(patient.status)}
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Policy: {patient.policyId}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Level</span>
                      {getRiskBadge(patient.riskLevel)}
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>DOB: {patient.dob}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{patient.address}</span>
                    </div>

                    {patient.conditions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Conditions:</span>
                        <div className="flex flex-wrap gap-1">
                          {patient.conditions.map((condition, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Last consultation:{" "}
                      {new Date(patient.lastConsultation).toLocaleDateString()}
                    </p>

                    <div className="flex flex-col space-y-2">
                      <Link to={`/consultation?patient=${patient.id}`}>
                        <Button size="sm" className="w-full">
                          Start Consultation
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
