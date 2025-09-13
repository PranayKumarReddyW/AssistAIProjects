import React, { useState, useRef, useEffect } from "react";
// Add WebSocket for real-time transcription
let ws: WebSocket | null = null;
import SpeechToTextDemo from "@/components/SpeechToTextDemo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Bot,
  User,
  Heart,
  AlertTriangle,
  CheckCircle,
  Edit3,
  RotateCcw,
  Send,
  Clock,
} from "lucide-react";

interface TranscriptionEntry {
  id: string;
  speaker: "doctor" | "patient";
  text: string;
  timestamp: Date;
  sentiment?: "neutral" | "confused" | "distressed" | "positive";
}

interface AIQuestion {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  category: string;
  isRecommended?: boolean;
}

interface TranscriptionPanelProps {
  currentLanguage: "en" | "hi";
  onConditionUpdate: (
    id: string,
    status: "unchecked" | "confirmed" | "denied" | "partial",
    details?: string
  ) => void;
}

export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  currentLanguage,
  onConditionUpdate,
}) => {
  const [transcription, setTranscription] = useState<TranscriptionEntry[]>([]);
  // Connect to backend Socket.io for real-time transcription
  useEffect(() => {
    // Import socket.io-client dynamically to avoid SSR issues
    let socket;
    import("socket.io-client").then(({ io }) => {
      socket = io("http://localhost:9000");
      socket.on("connect", () => {
        console.log("Socket.io connected for transcription");
        socket.emit("start-speech");
      });
      socket.on("transcript", (text) => {
        setTranscription((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            speaker: "patient",
            text,
            timestamp: new Date(),
            sentiment: "neutral",
          },
        ]);
      });
      socket.on("disconnect", () => {
        console.log("Socket.io disconnected");
      });
    });
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([
    {
      id: "1",
      text: "What medications are you currently taking for your diabetes?",
      priority: "high",
      category: "Diabetes Follow-up",
      isRecommended: true,
    },
    {
      id: "2",
      text: "How do you monitor your blood sugar levels?",
      priority: "high",
      category: "Diabetes Management",
    },
    {
      id: "3",
      text: "Have you experienced any complications from diabetes?",
      priority: "medium",
      category: "Diabetes Complications",
    },
  ]);

  const [customQuestion, setCustomQuestion] = useState("");
  const transcriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new transcription is added
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop =
        transcriptionRef.current.scrollHeight;
    }
  }, [transcription]);

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      const newEntry: TranscriptionEntry = {
        id: Date.now().toString(),
        speaker: "doctor",
        text: customQuestion,
        timestamp: new Date(),
        sentiment: "neutral",
      };
      setTranscription((prev) => [...prev, newEntry]);
      setCustomQuestion("");
    }
  };

  const useAIQuestion = (question: AIQuestion) => {
    const newEntry: TranscriptionEntry = {
      id: Date.now().toString(),
      speaker: "doctor",
      text: question.text,
      timestamp: new Date(),
      sentiment: "neutral",
    };
    setTranscription((prev) => [...prev, newEntry]);

    // Update AI questions based on the question used
    if (question.category === "Diabetes Follow-up") {
      onConditionUpdate(
        "diabetes",
        "partial",
        "Following up on medication and management"
      );
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "confused":
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case "distressed":
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case "positive":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Transcription Area */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            Real-Time Transcription
          </h2>
          <p className="text-sm text-muted-foreground">
            Language: {currentLanguage === "en" ? "English" : "हिंदी"}
          </p>
        </div>

        <div
          ref={transcriptionRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ height: "calc(100% - 80px)" }}
        >
          {transcription.map((entry) => (
            <div key={entry.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                {entry.speaker === "doctor" ? (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-medical-info/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-medical-info" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">
                    {entry.speaker === "doctor" ? "Doctor:" : "Rajesh Kumar:"}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(entry.timestamp)}
                  </span>
                  {getSentimentIcon(entry.sentiment)}
                </div>

                <div
                  className={`p-3 rounded-lg ${
                    entry.speaker === "doctor"
                      ? "bg-transcript-doctor"
                      : "bg-transcript-patient"
                  }`}
                >
                  <p className="text-sm">{entry.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestions Area */}
      <div className="border-t border-border">
        <div className="p-4 bg-ai-suggestion/30">
          <h3 className="font-semibold text-base flex items-center mb-3">
            <Bot className="h-4 w-4 mr-2 text-purple-600" />
            AI Question Suggestions
          </h3>

          <div className="space-y-2 mb-4">
            {aiQuestions.map((question) => (
              <Card
                key={question.id}
                className="p-3 cursor-pointer hover:bg-ai-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {question.isRecommended && (
                        <CheckCircle className="h-4 w-4 text-medical-success" />
                      )}
                      <Badge
                        variant={
                          question.priority === "high"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {question.category}
                      </Badge>
                    </div>
                    <p className="text-sm">{question.text}</p>
                  </div>

                  <div className="flex space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => useAIQuestion(question)}
                      className="h-8 w-8 p-0"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Custom Question Input with Speech-to-Text */}
          <div className="flex space-x-2 items-center">
            <Input
              placeholder="Type your custom question..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCustomQuestion()}
              className="flex-1"
            />
            <Button onClick={addCustomQuestion} size="sm">
              <Send className="h-4 w-4" />
            </Button>
            <div className="ml-2">
              <SpeechToTextDemo
                onTranscript={(text) => setCustomQuestion(text)}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
