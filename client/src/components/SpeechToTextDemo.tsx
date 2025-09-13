import React, { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";

export default function SpeechToTextDemo({ onTranscript }) {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (onTranscript) onTranscript(transcript);
  }, [transcript, onTranscript]);

  async function startRecording() {
    setRecording(true);
    setTranscript("");
    // Call backend API to start speech-to-text
    const res = await fetch("/api/speech-to-text/start", { method: "POST" });
    if (!res.ok) return;
    // Poll for transcript (demo purpose)
    intervalRef.current = setInterval(async () => {
      const r = await fetch("/api/speech-to-text/transcript");
      const data = await r.json();
      setTranscript(data.transcript || "");
    }, 1000);
  }

  async function stopRecording() {
    setRecording(false);
    await fetch("/api/speech-to-text/stop", { method: "POST" });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow flex flex-col items-center">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition ${
          recording ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        <Mic className="h-6 w-6" />
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <div className="mt-6 w-full text-lg text-gray-800 border-t pt-4 min-h-[48px]">
        <span className="font-bold">Transcript:</span> {transcript}
      </div>
    </div>
  );
}
