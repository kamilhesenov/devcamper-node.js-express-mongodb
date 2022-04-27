const express = require("express");
const router = express.Router();
const bootcampController = require("../controllers/bootcamp.js");
const courseRouter = require("./course.js");
const reviewRouter = require("./review.js");
const Bootcamp = require("../models/Bootcamp.js");
const advancedResult = require("../middleware/advancedResult.js");
const { protect, authorize } = require("../middleware/auth.js");

// Re-route into other resource routers
router.use("/:bootcampId/course", courseRouter);
router.use("/:bootcampId/review", reviewRouter);

router
  .route("/radius/:zipcode/:distance")
  .get(bootcampController.getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    bootcampController.bootcampPhotoUpload
  );

router
  .route("/")
  .get(advancedResult(Bootcamp, "course"), bootcampController.getBootcamps)
  .post(
    protect,
    authorize("publisher", "admin"),
    bootcampController.createBootcamp
  );

router
  .route("/:id")
  .get(bootcampController.getBootcamp)
  .put(
    protect,
    authorize("publisher", "admin"),
    bootcampController.updateBootcamp
  )
  .delete(
    protect,
    authorize("publisher", "admin"),
    bootcampController.deleteBootcamp
  );

module.exports = router;
