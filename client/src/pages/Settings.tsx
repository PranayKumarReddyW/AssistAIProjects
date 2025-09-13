import React, { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Mic,
  Video,
  Languages,
  Shield,
  Database,
  Download,
  Upload,
  Save,
  RefreshCw,
} from "lucide-react";

interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  reportAlerts: boolean;
  systemUpdates: boolean;
}

interface ConsultationSettings {
  defaultSessionDuration: number;
  autoRecording: boolean;
  transcriptionLanguage: "en" | "hi" | "auto";
  videoQuality: "low" | "medium" | "high";
  microphoneSensitivity: number;
  aiSuggestions: boolean;
  sentimentAnalysis: boolean;
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "consultation" | "security" | "data"
  >("profile");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState<DoctorProfile>({
    id: "doc1",
    name: "Dr. Singh",
    email: "dr.singh@acko.com",
    phone: "+91 98765 43210",
    specialization: "General Medicine",
    licenseNumber: "MED123456789",
    experience: 15,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    reportAlerts: true,
    systemUpdates: false,
  });

  const [consultation, setConsultation] = useState<ConsultationSettings>({
    defaultSessionDuration: 30,
    autoRecording: true,
    transcriptionLanguage: "auto",
    videoQuality: "high",
    microphoneSensitivity: 75,
    aiSuggestions: true,
    sentimentAnalysis: true,
  });

  // Replace with your actual token logic
  const token = localStorage.getItem("accessToken") || "YOUR_ACCESS_TOKEN_HERE";

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await getSettings(token);
      // Map API response to local state
      if (settings) {
        setProfile((prev) => ({
          ...prev,
          name: settings.userId || prev.name, // Adjust as needed
          email: settings.preferences?.email || prev.email,
          phone: prev.phone,
          specialization: prev.specialization,
          licenseNumber: prev.licenseNumber,
          experience: prev.experience,
        }));
        setNotifications({
          emailNotifications: settings.notificationSettings?.email ?? true,
          smsNotifications: settings.notificationSettings?.sms ?? false,
          pushNotifications: settings.notificationSettings?.push ?? true,
          appointmentReminders:
            settings.notificationSettings?.appointmentReminders ?? true,
          reportAlerts: settings.notificationSettings?.reportAlerts ?? true,
          systemUpdates: settings.notificationSettings?.systemUpdates ?? false,
        });
        // You can add consultation mapping if your API supports it
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Construct payload for API
      const payload = {
        preferences: {
          theme: "light", // You can add theme selection
          language: "en-US", // You can add language selection
        },
        notificationSettings: {
          email: notifications.emailNotifications,
          sms: notifications.smsNotifications,
          push: notifications.pushNotifications,
          appointmentReminders: notifications.appointmentReminders,
          reportAlerts: notifications.reportAlerts,
          systemUpdates: notifications.systemUpdates,
        },
      };
      await updateSettings(settingsIdOrUserId(), payload, token); // settingsIdOrUserId: replace with your logic
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setLoading(false);
  };

  // Helper to get settings ID or user ID for updateSettings
  const settingsIdOrUserId = () => {
    // Replace with your logic to get settings ID or user ID
    return "YOUR_SETTINGS_ID_HERE";
  };

  const exportData = async () => {
    // API Call: Export user data
    // GET /api/data/export
    console.log("Exporting consultation data...");

    // TODO: Implement actual data export
    // const response = await fetch('/api/data/export');
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'acko-medical-data.zip';
    // a.click();
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "consultation", label: "Consultation", icon: Video },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, preferences, and system configuration
          </p>
        </div>
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : saved ? (
            <span className="text-medical-success">Saved!</span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Doctor Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={profile.specialization}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            specialization: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input
                        id="license"
                        value={profile.licenseNumber}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            licenseNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={profile.experience}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            experience: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            smsNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive browser push notifications
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            pushNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="appointment-reminders">
                          Appointment Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get reminded about upcoming appointments
                        </p>
                      </div>
                      <Switch
                        id="appointment-reminders"
                        checked={notifications.appointmentReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            appointmentReminders: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="report-alerts">Report Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerts when reports need attention
                        </p>
                      </div>
                      <Switch
                        id="report-alerts"
                        checked={notifications.reportAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            reportAlerts: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Consultation Settings */}
            {activeTab === "consultation" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Consultation Preferences
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-duration">
                          Default Session Duration (minutes)
                        </Label>
                        <Input
                          id="session-duration"
                          type="number"
                          value={consultation.defaultSessionDuration}
                          onChange={(e) =>
                            setConsultation({
                              ...consultation,
                              defaultSessionDuration: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transcription-language">
                          Transcription Language
                        </Label>
                        <select
                          id="transcription-language"
                          value={consultation.transcriptionLanguage}
                          onChange={(e) =>
                            setConsultation({
                              ...consultation,
                              transcriptionLanguage: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="auto">Auto-detect</option>
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="video-quality">Video Quality</Label>
                        <select
                          id="video-quality"
                          value={consultation.videoQuality}
                          onChange={(e) =>
                            setConsultation({
                              ...consultation,
                              videoQuality: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="low">Low (saves bandwidth)</option>
                          <option value="medium">Medium</option>
                          <option value="high">High (best quality)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-recording">Auto Recording</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically record sessions
                          </p>
                        </div>
                        <Switch
                          id="auto-recording"
                          checked={consultation.autoRecording}
                          onCheckedChange={(checked) =>
                            setConsultation({
                              ...consultation,
                              autoRecording: checked,
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="ai-suggestions">AI Suggestions</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable AI-powered question suggestions
                          </p>
                        </div>
                        <Switch
                          id="ai-suggestions"
                          checked={consultation.aiSuggestions}
                          onCheckedChange={(checked) =>
                            setConsultation({
                              ...consultation,
                              aiSuggestions: checked,
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sentiment-analysis">
                            Sentiment Analysis
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Analyze patient emotional state
                          </p>
                        </div>
                        <Switch
                          id="sentiment-analysis"
                          checked={consultation.sentimentAnalysis}
                          onCheckedChange={(checked) =>
                            setConsultation({
                              ...consultation,
                              sentimentAnalysis: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Security & Privacy
                  </h2>
                  <div className="space-y-4">
                    <Card className="p-4 border-medical-warning">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-5 w-5 text-medical-warning" />
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" size="sm">
                        Enable 2FA
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Password</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Change your account password
                      </p>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Session Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        View and manage your active sessions
                      </p>
                      <Button variant="outline" size="sm">
                        View Sessions
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Data Management
                  </h2>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Download className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Export Data</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download all your consultation data and reports
                      </p>
                      <Button variant="outline" size="sm" onClick={exportData}>
                        Export All Data
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Upload className="h-5 w-5 text-medical-info" />
                        <h3 className="font-medium">Import Data</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Import consultation data from other systems
                      </p>
                      <Button variant="outline" size="sm">
                        Import Data
                      </Button>
                    </Card>

                    <Card className="p-4 border-medical-critical">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-5 w-5 text-medical-critical" />
                        <h3 className="font-medium text-medical-critical">
                          Data Retention
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Configure how long your data is stored
                      </p>
                      <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                        <option value="1">1 year</option>
                        <option value="2">2 years</option>
                        <option value="5">5 years</option>
                        <option value="forever">Forever</option>
                      </select>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
