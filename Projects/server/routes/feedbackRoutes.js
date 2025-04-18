const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Routes
router.get("/", feedbackController.getAllFeedbacks);
router.get("/fetch-feedback/:studentId", feedbackController.fetchFeedbackByStudent);
router.post("/submit-feedback/:bookingId", feedbackController.createFeedback);
router.put("/:id", feedbackController.updateFeedback);
router.delete("/:id", feedbackController.deleteFeedback);


module.exports = router;
