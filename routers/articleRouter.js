const articleRouter = require("express").Router();
const {
  getArticles,
  patchArticleById,
  getCommentsForArticle,
  postCommentToArticle,
} = require("../controllers/controllers");

articleRouter.route("/").get(getArticles);

articleRouter.route("/:article_id").get(getArticles).patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postCommentToArticle);

module.exports = articleRouter;
