const express = require("express");
const router = express.Router();
const Message = require("../models/MessageModel");

// Send a message
router.post("/", async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Get messages between two users
router.get("/", async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return res.status(400).json({ error: "Missing user ids." });
  }
  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort("timestamp");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

module.exports = router;
