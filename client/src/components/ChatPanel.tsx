import React, { useEffect, useState } from "react";

import socket from "../lib/socket";

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
}

interface ChatPanelProps {
  userId: string;
  peerId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ userId, peerId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Fetch messages between userId and peerId (initial load)
  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/messages?user1=${userId}&user2=${peerId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    }
    fetchMessages();
  }, [userId, peerId]);

  // Socket.io: join user room and listen for messages
  useEffect(() => {
    console.log("[Socket] Attempting to join room:", userId);
    if (socket && socket.connected) {
      console.log("[Socket] Connected:", socket.id);
    } else {
      socket.on("connect", () => {
        console.log("[Socket] Connected after waiting:", socket.id);
      });
    }
    socket.emit("join", userId);
    const handleMessage = (msg: Message) => {
      // Only add messages relevant to this chat
      if (
        (msg.senderId === userId && msg.receiverId === peerId) ||
        (msg.senderId === peerId && msg.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("chat message", handleMessage);
    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [userId, peerId]);

  // Send a message via socket.io and persist to backend
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      senderId: userId,
      receiverId: peerId,
      content: input,
    };
    socket.emit("chat message", msg);
    // Persist to backend
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    setInput("");
  }

  return (
    <div className="chat-panel border p-4 max-w-md mx-auto">
      <div className="messages mb-4 h-64 overflow-y-auto bg-gray-100 p-2 rounded">
        {messages.map((msg) => (
          <div
            key={msg._id || msg.timestamp || Math.random()}
            className={msg.senderId === userId ? "text-right" : "text-left"}
          >
            <span className="inline-block px-2 py-1 rounded bg-blue-200 m-1">
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
