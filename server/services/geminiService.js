const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genai = new GoogleGenerativeAI(GEMINI_API_KEY);

exports.getFollowupQuestions = async (answer) => {
  const prompt = `
    Patient said: "${answer}"

    Suggest 2 short, conversational follow-up questions
    a doctor could ask to clarify or probe further.
  `;
  const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result?.response?.text || "";
  return text
    .split("\n")
    .map((q) => q.replace(/^[-•\s]+/, "").trim())
    .filter((q) => q);
};
