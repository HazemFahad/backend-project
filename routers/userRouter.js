const userRouter = require("express").Router();

const {
  getUsernames,
  getUsersByUsername,
} = require("../controllers/controllers");

userRouter.route("/").get(getUsernames);

userRouter.route("/:username").get(getUsersByUsername);

module.exports = userRouter;
