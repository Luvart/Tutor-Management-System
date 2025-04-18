const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentsController");

// Routes
router.post("/", paymentsController.createPayments);
router.get("/ratings", paymentsController.getRatings);
router.get("/income", paymentsController.getIncome);
router.get("/student-payables/:studentId", paymentsController.getStudentPayables);
router.get("/get-tutors", paymentsController.getAllTutors);



module.exports = router;
