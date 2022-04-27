const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const Course = require("../models/Course.js");
const Bootcamp = require("../models/Bootcamp.js");

// @desc      Get courses
// @route     GET /api/v1/course
// @route     GET /api/v1/bootcamp/:bootcampId/course
// @access    Public
const getCourses = asyncHandler(async (request, response, next) => {
  if (request.params.bootcampId) {
    const courses = await Course.find({ bootcamp: request.params.bootcampId });

    return response.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    response.status(200).json(response.advancedResult);
  }
});

// @desc      Get single course
// @route     GET /api/v1/course/:id
// @access    Public
const getCourse = asyncHandler(async (request, response, next) => {
  const course = await Course.findById(request.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${request.params.id}`, 404)
    );
  }

  response.status(200).json({ success: true, data: course });
});

// @desc      Add course
// @route     POST /api/v1/bootcamp/:bootcampId/course
// @access    Private
const createCourse = asyncHandler(async (request, response, next) => {
  request.body.bootcamp = request.params.bootcampId;
  request.body.user = request.user.id;

  const bootcamp = await Bootcamp.findById(request.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${request.params.bootcampId}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (
    bootcamp.user.toString() !== request.user.id &&
    request.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${request.user.id} is not authorize to add a course to bootcamp ${bootcamp._id} `,
        401
      )
    );
  }

  const course = await Course.create(request.body);

  response.status(201).json({ success: true, data: course });
});

// @desc      Update course
// @route     PUT /api/v1/course/:id
// @access    Private
const updateCourse = asyncHandler(async (request, response, next) => {
  let course = await Course.findById(request.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${request.params.id}`)
    );
  }

  // Make sure user is bootcamp owner
  if (
    course.user.toString() !== request.user.id &&
    request.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${request.user.id} is not authorize to update a course ${course._id} `,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({ success: true, data: course });
});

// @desc      Delete course
// @route     DELETE /api/v1/course/:id
// @access    Private
const deleteCourse = asyncHandler(async (request, response, next) => {
  const course = await Course.findById(request.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${request.params.id}`)
    );
  }

  // Make sure user is bootcamp owner
  if (
    course.user.toString() !== request.user.id &&
    request.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${request.user.id} is not authorize to delete a course ${course._id} `,
        401
      )
    );
  }

  await course.remove();

  response.status(200).json({ success: true, data: course });
});

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
