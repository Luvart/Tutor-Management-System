const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.get("/", userController.getAllUsers);
router.get("/orderCreatedBy-Mssg", userController.getAllUsersOrderCreatedByMssg);
router.get("/fetch-students", userController.getAllStudentsEnrolled);
router.get("/fetch-profile/:userId", userController.getProfile);
router.put("/update-profile/:userId", userController.updateProfile);
router.post("/register", userController.createUser);
router.post("/registerVAdmin", userController.createUserVAdmin);
router.post("/login", userController.loginUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
