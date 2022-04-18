const express = require("express");

const apiRouter = require("./routers/apiRouter.js");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", function (req, res, next) {
  res.status(404).send({ msg: "Page not Found" });
});

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "42601" ||
    err.code === "42703" ||
    err.code === "23502"
  ) {
    return res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
