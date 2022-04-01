const userRouter = require("express").Router();

const { getUsernames } = require("../controllers/controllers");

userRouter.route("/").get(getUsernames);

module.exports = userRouter;
