const express = require("express");

const {
  getTopics,
  getArticles,
  patchArticleById,
  getUsernames,
  getCommentsForArticle,
  postCommentToArticle,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.get("/api/users", getUsernames);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.all("/*", function (req, res, next) {
  res.status(404).send({ msg: "Page not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42601" || err.code === "42703") {
    // console.log(err);
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
  console.log(err);

  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
