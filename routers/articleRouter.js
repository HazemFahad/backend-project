const articleRouter = require("express").Router();
const {
  getArticles,
  patchArticleById,
  getCommentsForArticle,
  postCommentToArticle,
  postArticle,
} = require("../controllers/controllers");

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter.route("/:article_id").get(getArticles).patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postCommentToArticle);

module.exports = articleRouter;
