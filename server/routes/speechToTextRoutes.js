const express = require("express");
const router = express.Router();

const speechToTextController = require("../controllers/speechToTextController");

router.post("/start", speechToTextController.startRecording);
router.post("/stop", speechToTextController.stopRecording);
router.get("/transcript", speechToTextController.getTranscript);
router.post("/audio", speechToTextController.sendAudio);

module.exports = router;
