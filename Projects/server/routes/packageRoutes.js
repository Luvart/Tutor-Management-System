const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

// Routes
router.get("/fetch-package", packageController.getAllPackages);
router.get("/fetch-packagebyTutor/:id", packageController.getTutorPackages);
router.get("/fetch-active-package", packageController.getActivePackages);
router.get("/fetch-to-enroll-package", packageController.getToEnrollPackage);
router.post("/create-package", packageController.createPackage);
router.put("/update-status/:packageId", packageController.updatePackageStatus);
router.put("/:id", packageController.updatePackage);
router.delete("/:id", packageController.deletePackage);

module.exports = router;
