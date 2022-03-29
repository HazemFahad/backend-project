const express = require("express");

const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsernames,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsernames);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", function (req, res, next) {
  res.status(404).send({ msg: "Page not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
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
