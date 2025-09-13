const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationControler.js");
router.get("/", conversationController.getConversation);
router.post("/doctor_question", conversationController.doctorQuestion);
router.post("/patient_answer", conversationController.patientAnswer);
router.post("/reset", conversationController.resetConversation);

module.exports = router;
