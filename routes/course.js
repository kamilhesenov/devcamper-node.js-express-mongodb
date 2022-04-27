const express = require("express");
const router = express.Router({ mergeParams: true });
const courseController = require("../controllers/course.js");
const Course = require("../models/Course.js");
const adnancedResult = require("../middleware/advancedResult.js");
const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(
    adnancedResult(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    courseController.getCourses
  )
  .post(
    protect,
    authorize("publisher", "admin"),
    courseController.createCourse
  );

router
  .route("/:id")
  .get(courseController.getCourse)
  .put(protect, authorize("publisher", "admin"), courseController.updateCourse)
  .delete(
    protect,
    authorize("publisher", "admin"),
    courseController.deleteCourse
  );

module.exports = router;
