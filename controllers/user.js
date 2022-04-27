const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const User = require("../models/User.js");

// @desc      Get all users
// @route     GET /api/v1/auth/user
// @access    Private/Admin
const getUsers = asyncHandler(async (request, response, next) => {
  response.status(200).json(response.advancedResult);
});

// @desc      Get single user
// @route     GET /api/v1/auth/user/:id
// @access    Private/Admin
const getUser = asyncHandler(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `Can not find user with id of ${request.params.id}`,
        404
      )
    );
  }

  response.status(200).json({ success: true, data: user });
});

// @desc      Create user
// @route     POST /api/v1/auth/user
// @access    Private/Admin
const createUser = asyncHandler(async (request, response, next) => {
  const user = await User.create(request.body);

  response.status(201).json({ success: true, data: user });
});

// @desc      Update user
// @route     PUT /api/v1/auth/user/:id
// @access    Private/Admin
const updateUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(
        `Can not find user with id of ${request.params.id} for update`,
        404
      )
    );
  }

  response.status(200).json({ success: true, data: user });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/user/:id
// @access    Private/Admin
const deleteUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `Can not find user with id of ${request.params.id} for delete`,
        404
      )
    );
  }

  response.status(200).json({ success: true, data: user });
});

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser };
