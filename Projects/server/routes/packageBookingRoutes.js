const express = require("express");
const router = express.Router();
const packageBookingController = require("../controllers/packageBookingController");

// Routes
router.get("/fetch-booked-package", packageBookingController.getAllPackageBooking);
router.get("/fetch-active-package", packageBookingController.getActivePackageBooking);
router.get("/fetch-booked-packagebyTutor/:tutorId", packageBookingController.getPackagebookingbyTutor);
router.get("/check-booking-status", packageBookingController.checkBookingStatus);
router.get("/check-fully-paid-status:/:studentId", packageBookingController.checkFullyPaidStatus);
router.post("/book-package", packageBookingController.createPackageBooking);
router.put("/approve/:id", packageBookingController.approveBooking);
router.put("/status/:id", packageBookingController.rejectBooking);

module.exports = router;
