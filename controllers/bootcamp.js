const geocoder = require("../utils/geocoder.js");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const Bootcamp = require("../models/Bootcamp.js");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamp
// @access    Public
const getBootcamps = asyncHandler(async (request, response, next) => {
  response.status(200).json(response.advancedResult);
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamp/:id
// @access    Public
const getBootcamp = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.findById(request.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${request.params.id}`,
        404
      )
    );
  }

  response.status(200).json({ success: true, data: bootcamp });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamp
// @access    Private
const createBootcamp = asyncHandler(async (request, response, next) => {
  // Add user to request body
  request.body.user = request.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: request.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && request.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${request.user.id} has alredy published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(request.body);

  response.status(201).json({ success: true, data: bootcamp });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamp/:id
// @access    Private
const updateBootcamp = asyncHandler(async (request, response, next) => {
  let bootcamp = await Bootcamp.findById(request.params.is);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${request.params.id}`,
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
        `User ${request.params.id} is not authorize to update this bootcamp `,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamp/:id
// @access    Private
const deleteBootcamp = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.findById(request.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${request.params.id}`,
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
        `User ${request.params.id} is not authorize to delete this bootcamp `,
        401
      )
    );
  }

  bootcamp.remove();

  response.status(200).json({ success: true, data: bootcamp });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamp/radius/:zipcode/:distance
// @access    Private
const getBootcampsInRadius = asyncHandler(async (request, response, next) => {
  const { zipcode, distance } = request.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  response
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamp/:id/photo
// @access    Private
const bootcampPhotoUpload = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.findById(request.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${request.params.id}`,
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
        `User ${request.params.id} is not authorize to upload photo `,
        401
      )
    );
  }

  if (!request.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = request.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATHS}/${file.name}`, async (error) => {
    if (error) {
      console.error(error);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(request.params.id, { photo: file.name });

    response.status(200).json({ success: true, data: file.name });
  });
});

module.exports = {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
};
