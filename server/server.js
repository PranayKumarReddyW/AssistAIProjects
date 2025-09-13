require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = process.env.PORT || 9000;
const cors = require("cors");
const connectDB = require("./db/db");
connectDB();
// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  // Join user room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room.`);
  });

  // Emit chat message to sender and receiver rooms only
  socket.on("chat message", (msg) => {
    if (msg.senderId && msg.receiverId) {
      io.to(msg.senderId).emit("chat message", msg);
      io.to(msg.receiverId).emit("chat message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  // --- Speech-to-Text Streaming ---
  // Store AssemblyAI WebSocket per client
  const assemblyAIConnections = global.assemblyAIConnections || new Map();
  global.assemblyAIConnections = assemblyAIConnections;

  socket.on("start-speech", () => {
    console.log(`[${socket.id}] start-speech received`);
    const WebSocket = require("ws");
    const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
    const url =
      "wss://api.assemblyai.com/v2/streaming/ws?sample_rate=16000&encoding=pcm_s16le&format_turns=true";
    const ws = new WebSocket(url, {
      headers: { Authorization: ASSEMBLYAI_API_KEY },
    });
    ws.on("open", () => {
      console.log(`[${socket.id}] AssemblyAI WS opened`);
    });
    ws.on("message", (msg) => {
      const str = Buffer.isBuffer(msg) ? msg.toString() : msg;
      console.log(`[${socket.id}] AssemblyAI WS message received:`, str);
      try {
        const data = JSON.parse(str);
        if (data.text) {
          console.log(`[${socket.id}] AssemblyAI transcript:`, data.text);
          socket.emit("transcript", data.text);
        } else if (data.error) {
          console.error(`[${socket.id}] AssemblyAI error:`, data.error);
        }
      } catch (e) {
        console.error(`[${socket.id}] AssemblyAI message error:`, e);
      }
    });
    ws.on("error", (err) => {
      console.error(`[${socket.id}] AssemblyAI WS error:`, err);
    });
    ws.on("close", () => {
      console.log(`[${socket.id}] AssemblyAI WS closed`);
    });
    assemblyAIConnections.set(socket.id, ws);
  });

  socket.on("audio-chunk", (chunk) => {
    console.log(`[${socket.id}] audio-chunk received, size: ${chunk.length}`);
    const ws = assemblyAIConnections.get(socket.id);
    if (ws && ws.readyState === 1) {
      ws.send(chunk);
      console.log(`[${socket.id}] audio-chunk sent to AssemblyAI`);
    } else {
      console.warn(
        `[${socket.id}] AssemblyAI WS not ready to receive audio chunk.`
      );
    }
  });

  socket.on("stop-speech", () => {
    console.log(`[${socket.id}] stop-speech received`);
    const ws = assemblyAIConnections.get(socket.id);
    if (ws) {
      ws.close();
      assemblyAIConnections.delete(socket.id);
      console.log(
        `[${socket.id}] AssemblyAI WS closed and removed from connections.`
      );
    } else {
      console.warn(`[${socket.id}] No AssemblyAI WS found to close.`);
    }
  });
});

// Express Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Healthcare Backend API is running!");
});

// API Routes
app.use("/api/conversation", require("./routes/ConversatonRoutes.js"));
app.use("/api/speech-to-text", require("./routes/speechToTextRoutes.js"));
app.use("/api/messages", require("./routes/MessageRoutes.js"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/transcription", require("./routes/transcriptionRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start HTTP server (Express + Socket.io)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start AssemblyAI websocket
  const { connectToAssemblyAI } = require("./services/assemblyaiService");
  const conversationController = require("./controllers/conversationControler.js");
  connectToAssemblyAI(conversationController.conversation_log);
});
