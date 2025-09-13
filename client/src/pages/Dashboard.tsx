import React, { useState, useEffect } from "react";
import { getAppointments, getReports, getPatients } from "../lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Activity,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  todayConsultations: number;
  pendingReports: number;
  totalPatients: number;
  averageSessionTime: string;
}

interface UpcomingAppointment {
  id: string;
  patientName: string;
  time: string;
  type: "MER" | "Follow-up" | "New Patient";
  status: "scheduled" | "in-progress" | "completed";
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todayConsultations: 0,
    pendingReports: 0,
    totalPatients: 0,
    averageSessionTime: "0m",
  });

  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchTodayAppointments();
    fetchRecentActivity();
  }, []);

  const token = localStorage.getItem("accessToken") || "YOUR_ACCESS_TOKEN_HERE";

  const fetchDashboardStats = async () => {
    try {
      // Example: Use getReports, getPatients, getAppointments to calculate stats
      const reports = await getReports(token);
      const patients = await getPatients(token);
      const appointments = await getAppointments(token);
      setStats({
        todayConsultations: appointments.length,
        pendingReports: reports.filter((r) => r.status === "draft").length,
        totalPatients: patients.length,
        averageSessionTime: "24m", // Replace with actual calculation if available
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const params = { date: today };
      const data = await getAppointments(token, params);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching today appointments:", error);
    }
  };

  const fetchRecentActivity = async () => {
    // You can implement a real API call for recent activity if available
    // For now, leave as empty or use a placeholder
    setRecentActivity([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge className="bg-medical-info text-medical-info-foreground">
            In Progress
          </Badge>
        );
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "completed":
        return (
          <Badge className="bg-medical-success text-medical-success-foreground">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Singh. Here's your medical consultation overview.
          </p>
        </div>
        <Link to="/consultation">
          <Button
            size="lg"
            className="bg-medical-success hover:bg-medical-success/90"
          >
            <Play className="h-5 w-5 mr-2" />
            Start New Consultation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.todayConsultations}</p>
              <p className="text-sm text-muted-foreground">
                Today's Consultations
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-medical-warning" />
            <div>
              <p className="text-2xl font-bold">{stats.pendingReports}</p>
              <p className="text-sm text-muted-foreground">Pending Reports</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-medical-info" />
            <div>
              <p className="text-2xl font-bold">{stats.totalPatients}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-medical-success" />
            <div>
              <p className="text-2xl font-bold">{stats.averageSessionTime}</p>
              <p className="text-sm text-muted-foreground">Avg Session Time</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <Link to="/appointments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time} - {appointment.type}
                    </p>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-medical-success mt-2" />
                <p className="text-sm text-muted-foreground">{activity}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/patients">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Patients
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
