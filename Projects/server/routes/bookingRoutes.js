const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Admin
router.post("/create-booking", bookingController.createBooking);
router.get("/fetch-approved-booking", bookingController.getApprovedBookings);
router.get("/fetch-approved-booking-forsessions", bookingController.getApprovedBookingsForSessions);
router.get("/fetch-approved-booking-forsessions-perstudent/:studentId", bookingController.getApprovedBookingsForSessionsperStudent);
router.get("/fetch-approved-booking-forsessions-pertutor/:tutorId", bookingController.getApprovedBookingsForSessionsperTutor);
router.get("/fetch-booking-submission", bookingController.fetchBookingSubmission);
router.get("/fetch-booking-submission/:packageId", bookingController.fetchBookingSubmissionsByPackage);
router.get("/fetch-booking-submissionbyuser/:userId", bookingController.fetchBookingSubmissionByUser);
router.get("/get-tutorsSched/:tutorId", bookingController.getTutorSchedules);
router.put("/update-status/:bookingId", bookingController.updateBookingStatus);
router.put("/record-session/:id", bookingController.recordSession);

// Client
router.get("/fetch-Packagebooking/:userId", bookingController.fetchScheduleBooking);
router.get("/fetch-pending-booking", bookingController.fetchPendingBooking);


module.exports = router;
