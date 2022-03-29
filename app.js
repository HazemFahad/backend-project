const express = require("express");

const {
  returnTopics,
  returnArticle,
  addVotesToArticle,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", returnTopics);

app.get("/api/articles/:article_id", returnArticle);

app.patch("/api/articles/:article_id", addVotesToArticle);

app.get("*", function (req, res) {
  res.status(404).send({ msg: "Page not Found" });
});

app.patch("*", function (req, res) {
  res.status(404).send({ msg: "Page not Found" });
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
