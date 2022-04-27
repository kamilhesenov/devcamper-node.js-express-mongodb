const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review.js");
const Review = require("../models/Review.js");
const advancedResult = require("../middleware/advancedResult.js");
const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(
    advancedResult(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    reviewController.getReviews
  )
  .post(protect, authorize("user", "admin"), reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .put(protect, authorize("user", "admin"), reviewController.updateReview)
  .delete(protect, authorize("user", "admin"), reviewController.deleteReview);

module.exports = router;
