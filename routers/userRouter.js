const userRouter = require("express").Router();

const {
  getUsernames,
  getUsersByUsername,
  getFullUserData,
} = require("../controllers/controllers");

userRouter.route("/").get(getUsernames);

userRouter.route("/fullusers").get(getFullUserData);

userRouter.route("/fullusers/:username").get(getUsersByUsername);

module.exports = userRouter;
