const WebSocket = require("ws");
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

function handleTranscript(msg, conversation_log) {
  const data = JSON.parse(msg);
  if (data.type === "Turn") {
    const transcript = data.transcript || "";
    const speaker = data.speaker === "A" ? "patient" : "doctor";
    conversation_log.push({ role: speaker, text: transcript });
    console.log(`${speaker}: ${transcript}`);
  }
}

function connectToAssemblyAI(conversation_log) {
  const url =
    "wss://streaming.assemblyai.com/v3/ws?" +
    new URLSearchParams({ sample_rate: 16000, format_turns: true }).toString();

  const ws = new WebSocket(url, {
    headers: { Authorization: ASSEMBLYAI_API_KEY },
  });

  ws.on("message", (msg) => handleTranscript(msg, conversation_log));
  ws.on("open", () => console.log("Connected to AssemblyAI"));
  ws.on("error", (err) => console.error("AssemblyAI error:", err));
}

module.exports = { connectToAssemblyAI };
