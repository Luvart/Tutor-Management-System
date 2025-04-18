const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

router.get("/get-schedules", scheduleController.getAllSchedules);
router.get("/get-schedulespertutor/:tutorId", scheduleController.getSchedulesPerTutor);
router.get("/tutor-packages", scheduleController.getTutorPackages);
router.get("/tutor-packagesbyTutor/:id", scheduleController.getTutorPackagesbyTutor);
router.get("/tutor", scheduleController.getAllTutors);
router.get("/fetch-by-package/:packageId", scheduleController.getScheduleByPackage);
router.post("/save-schedule", scheduleController.createSchedule);
router.put("/:id", scheduleController.updateSchedule);
router.delete("/delete-schedule/:id", scheduleController.deleteSchedule);

router.get("/fetch-schedules-bookable", scheduleController.fetchSchedulesBookable);

module.exports = router;
