const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.js");
const { protect } = require("../middleware/auth.js");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/singleUser").get(protect, userController.getSingleUser);
router.route("/forgotpassword").post(userController.forgotPassword);
router.route("/resetpassword/:resettoken").put(userController.resetPassword);
router.route("/updatedetails").put(protect, userController.updateDetails);
router.route("/updatepassword").put(protect, userController.updatePassword);
router.route("/logout").get(userController.logout);

module.exports = router;
