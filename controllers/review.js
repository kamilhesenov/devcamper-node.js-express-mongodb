const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const Review = require("../models/Review.js");
const Bootcamp = require("../models/Bootcamp.js");

// @desc      Get reviews
// @route     GET /api/v1/review
// @route     GET /api/v1/bootcamp/:bootcampId/review
// @access    Public
const getReviews = asyncHandler(async (request, response, next) => {
  if (request.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: request.params.bootcampId });

    return response
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    response.status(200).json(response.advancedResult);
  }
});

// @desc      Get single review
// @route     GET /api/v1/review/:id
// @access    Public
const getReview = asyncHandler(async (request, response, next) => {
  const review = await Review.findById(request.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(
        `Can not find Review with id of ${request.params.id}`,
        404
      )
    );
  }

  response.status(200).json({ success: true, data: review });
});

// @desc      Add review
// @route     POST /api/v1/bootcamp/:bootcampId/review
// @access    Private
const createReview = asyncHandler(async (request, response, next) => {
  request.body.bootcamp = request.params.bootcampId;
  request.body.user = request.user.id;

  const bootcamp = await Bootcamp.findById(request.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Can not find Bootcamp with id of ${request.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(request.body);

  response.status(201).json({ success: true, data: review });
});

// @desc      Update review
// @route     PUT /api/v1/review/:id
// @access    Private
const updateReview = asyncHandler(async (request, response, next) => {
  let review = await Review.findById(request.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `Can not find Review with id of ${request.params.id}`,
        404
      )
    );
  }

  // Make sure review belongs to user or user is admin
  if (
    review.user.toString() !== request.user.id &&
    request.user.role !== "admin"
  ) {
    return next(new ErrorResponse("Not authorized to update Review", 401));
  }

  review = await Review.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({ success: true, data: review });
});

// @desc      Delete review
// @route     DELETE /api/v1/review/:id
// @access    Private
const deleteReview = asyncHandler(async (request, response, next) => {
  const review = await Review.findById(request.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `Can not find Review with id of ${request.params.id}`,
        404
      )
    );
  }

  // Make sure review belongs to user or user is admin
  if (
    review.user.toString() !== request.user.id &&
    request.user.role !== "admin"
  ) {
    return next(new ErrorResponse("Not authorized to delete Review", 401));
  }

  await review.remove();

  response.status(200).json({ success: true, data: review });
});

module.exports = {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
};
