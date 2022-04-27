const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load models
const Bootcamp = require("./models/Bootcamp.js");
const Course = require("./models/Course.js");
const User = require("./models/User.js");
const Review = require("./models/Review.js");

// Load env vars
dotenv.config("./config/config.env");

// Connect to DB
const url =
  "mongodb+srv://kamil90:kamil90@devcamper.xm9zx.mongodb.net/devcamper?retryWrites=true&w=majority";

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`));

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

    console.log("Data Imported...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data Destroyed...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
