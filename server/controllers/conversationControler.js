const { getFollowupQuestions } = require("../services/geminiService");

// Export conversation_log as a property of module.exports for consistent reference
const conversation_log = [];
module.exports.conversation_log = conversation_log;

exports.getConversation = (req, res) => {
  res.json({ conversation: conversation_log });
};

exports.doctorQuestion = (req, res) => {
  const { text } = req.body;
  conversation_log.push({ role: "doctor", text });
  res.json({ status: "ok" });
};

exports.patientAnswer = async (req, res) => {
  const { text } = req.body;
  conversation_log.push({ role: "patient", text });
  const followups = await getFollowupQuestions(text);
  res.json({ followups });
};

exports.resetConversation = (req, res) => {
  conversation_log.length = 0;
  res.json({ status: "conversation reset" });
};
