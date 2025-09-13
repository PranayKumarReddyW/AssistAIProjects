const { connectToAssemblyAI } = require("../services/assemblyaiService");

// In-memory transcript for demo
let isRecording = false;
let transcript = "";

function startRecording(req, res) {
  isRecording = true;
  transcript = "";
  // TODO: Start AssemblyAI streaming and update transcript
  res.json({ started: true });
}

function stopRecording(req, res) {
  isRecording = false;
  // TODO: Stop AssemblyAI streaming
  res.json({ stopped: true });
}

function getTranscript(req, res) {
  // TODO: Return live transcript from AssemblyAI
  res.json({ transcript });
}

function sendAudio(req, res) {
  // TODO: Forward audio chunk to AssemblyAI
  res.json({ sent: true });
}

module.exports = { startRecording, stopRecording, getTranscript, sendAudio };
