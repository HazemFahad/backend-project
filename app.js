const express = require("express");

const { returnTopics } = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", returnTopics);

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
