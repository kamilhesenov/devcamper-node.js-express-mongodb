const jwt = require("jsonwebtoken");
const asyncHandler = require("./async.js");
const ErrorResponse = require("../utils/errorResponse.js");
const User = require("../models/User.js");

// Protect routes
const protect = asyncHandler(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = request.headers.authorization.split(" ")[1];
    // Set token from cookie
  }
  // else if(request.cookies.token){
  //   token = request.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECURITY);

    request.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${request.user.role} is not authorize to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
