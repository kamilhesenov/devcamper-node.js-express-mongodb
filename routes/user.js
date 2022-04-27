const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");
const User = require("../models/User.js");
const advancedResult = require("../middleware/advancedResult.js");
const { protect, authorize } = require("../middleware/auth.js");

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedResult(User), userController.getUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
