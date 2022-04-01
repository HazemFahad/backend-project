const topicsRouter = require("./topicsRouter.js");
const articleRouter = require("./articleRouter");
const commentRouter = require("./commentRouter");
const userRouter = require("./userRouter");

const apiRouter = require("express").Router();

const { readFileAndSend } = require("../controllers/controllers");

apiRouter.get("/", readFileAndSend);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/users", userRouter);

module.exports = apiRouter;
