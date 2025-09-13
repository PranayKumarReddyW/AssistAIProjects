import React, { useState, useEffect } from "react";
import { getReports, createReport, updateReport } from "../lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

interface MedicalReport {
  id: string;
  patientName: string;
  patientId: string;
  policyId: string;
  consultationDate: string;
  reportType: "MER" | "Follow-up" | "Specialist" | "Emergency";
  status: "draft" | "completed" | "reviewed" | "sent";
  findings: string[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  doctorName: string;
  generatedDate: string;
  fileSize?: string;
}

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "completed" | "sent"
  >("all");
  const [filterType, setFilterType] = useState<
    "all" | "MER" | "Follow-up" | "Specialist"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [searchTerm, filterStatus, filterType]);

  const token = localStorage.getItem("accessToken") || "YOUR_ACCESS_TOKEN_HERE";

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        status: filterStatus,
        type: filterType, 
      };
      const data = await getReports(token, params);
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  const generateReport = async (consultationId: string) => {
    try {
      await createReport({ consultationId }, token);
      fetchReports();
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const downloadReport = async (reportId: string) => {
    // API Call: Download report as PDF
    // GET /api/reports/${reportId}/download
    console.log("Downloading report:", reportId);

    // TODO: Implement actual download functionality
    // const response = await fetch(`/api/reports/${reportId}/download`);
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `medical-report-${reportId}.pdf`;
    // a.click();
  };

  const updateReportStatus = async (
    reportId: string,
    status: MedicalReport["status"]
  ) => {
    try {
      await updateReport(reportId, { status }, token);
      fetchReports();
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const getStatusBadge = (status: MedicalReport["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "completed":
        return (
          <Badge className="bg-medical-info text-medical-info-foreground">
            Completed
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="bg-medical-warning text-medical-warning-foreground">
            Reviewed
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-medical-success text-medical-success-foreground">
            Sent
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRiskBadge = (risk: MedicalReport["riskLevel"]) => {
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

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.policyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    const matchesType =
      filterType === "all" || report.reportType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-muted-foreground">
            Generate, review, and manage medical examination reports
          </p>
        </div>
        <Button size="lg" onClick={() => generateReport("new")}>
          <FileText className="h-5 w-5 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by patient name or policy ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 rounded-md border border-input bg-background"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="sent">Sent</option>
            </select>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="all">All Types</option>
            <option value="MER">MER</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Specialist">Specialist</option>
          </select>
        </div>
      </Card>

      {/* Reports Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <p className="text-lg font-bold">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-medical-warning" />
            <div>
              <p className="text-lg font-bold">
                {reports.filter((r) => r.status === "draft").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-medical-success" />
            <div>
              <p className="text-lg font-bold">
                {reports.filter((r) => r.status === "sent").length}
              </p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-medical-critical" />
            <div>
              <p className="text-lg font-bold">
                {reports.filter((r) => r.riskLevel === "high").length}
              </p>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Loading reports...
            </div>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              No reports found
            </div>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {report.patientName}
                    </h3>
                    {getStatusBadge(report.status)}
                    {getRiskBadge(report.riskLevel)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>Policy: {report.policyId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Consultation:{" "}
                          {new Date(
                            report.consultationDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div>
                        Type:{" "}
                        <span className="font-medium">{report.reportType}</span>
                      </div>
                      <div>
                        Doctor:{" "}
                        <span className="font-medium">{report.doctorName}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div>
                        Generated:{" "}
                        {new Date(report.generatedDate).toLocaleDateString()}
                      </div>
                      {report.fileSize && <div>Size: {report.fileSize}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(report.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(report.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Findings */}
                <div>
                  <h4 className="font-medium mb-2">Key Findings</h4>
                  <ul className="space-y-1 text-sm">
                    {report.findings.map((finding, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-sm">
                    {report.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 rounded-full bg-medical-success mt-2" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {report.status === "draft" && (
                <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "completed")}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "reviewed")}
                  >
                    Send for Review
                  </Button>
                </div>
              )}

              {report.status === "completed" && (
                <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "sent")}
                  >
                    Send to Patient
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
