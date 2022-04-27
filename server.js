const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const logger = require("./middleware/logger.js");
const ErrorHandler = require("./middleware/error.js");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Route files
const bootcampRouter = require("./routes/bootcamp.js");
const courseRouter = require("./routes/course.js");
const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logs request to console
app.use(logger);

// File uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMe: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname + "public")));

// Mount routers
app.use("/api/v1/bootcamp", bootcampRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
