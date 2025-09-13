import React, { useState, useEffect } from "react";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
} from "../lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Video,
  Plus,
  Filter,
  CheckCircle,
  AlertTriangle,
  Play,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  policyId: string;
  date: string;
  time: string;
  type: "MER" | "Follow-up" | "New Patient" | "Emergency";
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  duration: number; // in minutes
  notes?: string;
  priority: "low" | "medium" | "high";
}

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<
    "all" | "scheduled" | "completed"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, filterStatus]);

  const token = localStorage.getItem("accessToken") || "YOUR_ACCESS_TOKEN_HERE";

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const params = { date: dateStr, status: filterStatus };
      const data = await getAppointments(token, params);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };

  const scheduleAppointment = async (appointmentData: Partial<Appointment>) => {
    try {
      await createAppointment(appointmentData, token);
      fetchAppointments();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: Appointment["status"]
  ) => {
    try {
      await updateAppointment(appointmentId, { status }, token);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "in-progress":
        return (
          <Badge className="bg-medical-info text-medical-info-foreground">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-medical-success text-medical-success-foreground">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-medical-critical text-medical-critical-foreground">
            Cancelled
          </Badge>
        );
      case "no-show":
        return (
          <Badge className="bg-medical-warning text-medical-warning-foreground">
            No Show
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityIcon = (priority: Appointment["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-medical-critical" />;
      case "medium":
        return <Clock className="h-4 w-4 text-medical-warning" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-medical-success" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: Appointment["type"]) => {
    switch (type) {
      case "Emergency":
        return "text-medical-critical";
      case "MER":
        return "text-primary";
      case "Follow-up":
        return "text-medical-warning";
      case "New Patient":
        return "text-medical-success";
      default:
        return "text-muted-foreground";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filterStatus === "all") return true;
    return appointment.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your consultation schedule and patient appointments
          </p>
        </div>
        <Button size="lg" onClick={() => scheduleAppointment({})}>
          <Plus className="h-5 w-5 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Calendar</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter Status</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="all">All Appointments</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Appointments for {selectedDate.toLocaleDateString()}
              </h2>
              <Badge variant="outline">
                {filteredAppointments.length} appointments
              </Badge>
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading appointments...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No appointments found for this date
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="p-4 border-l-4 border-l-primary"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Patient & Time Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {appointment.patientName}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {appointment.time} ({appointment.duration}min)
                            </span>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            Policy: {appointment.policyId}
                          </div>
                        </div>

                        {/* Type & Priority */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(appointment.priority)}
                            <span
                              className={`font-medium ${getTypeColor(
                                appointment.type
                              )}`}
                            >
                              {appointment.type}
                            </span>
                          </div>

                          {getStatusBadge(appointment.status)}

                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground">
                              {appointment.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          {appointment.status === "scheduled" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "in-progress"
                                )
                              }
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Consultation
                            </Button>
                          )}

                          {appointment.status === "in-progress" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "completed"
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          )}

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Video className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
