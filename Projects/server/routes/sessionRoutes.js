const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Routes
router.get("/", sessionController.getAllSessions);
router.post("/create-session", sessionController.createSession);
router.put("/update-status/:bookingId", sessionController.updateSessionStatus);
router.delete("/:id", sessionController.deleteSession);
router.put("/update-statusBooking/", sessionController.updateStatusBooking);

module.exports = router;
