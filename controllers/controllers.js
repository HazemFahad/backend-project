const fs = require("fs/promises");

const {
  getTopics,
  fetchArticles,
  updateVotes,
  getAllUsers,
  fetchCommentsForArticle,
  addCommentToArticle,
  checkSomethingExists,
  removeComment,
} = require("../models/models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await getTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const { sort_by, order, topic } = req.query;

    const allTopics = await getTopics();

    const article = await fetchArticles(
      articleID,
      sort_by,
      order,
      topic,
      allTopics
    );
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const voteNum = req.body.inc_votes;

    const article = await updateVotes(articleID, voteNum);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getUsernames = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsForArticle = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const articleCheck = await checkSomethingExists(articleID, "articles");

    const comments = await fetchCommentsForArticle(articleID);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

/* ***************POST COMMENTS FOR EACH ARTICLE BY ID****************/

exports.postCommentToArticle = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const { body, username } = req.body;

    const articleCheck = await checkSomethingExists(articleID, "articles");

    const newComment = await addCommentToArticle(articleID, username, body);
    res.status(201).send({ newComment });
  } catch (err) {
    next(err);
  }
};

/* ***************DELETE COMMENTS BY ID****************/
exports.deleteComment = async (req, res, next) => {
  try {
    const commentID = req.params.comment_id;
    const commentCheck = await checkSomethingExists(commentID, "comments");

    const deletedComment = await removeComment(commentID);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/* ***************GET API RETURNS ENDPOINTS ****************/

exports.readFileAndSend = async (req, res, next) => {
  try {
    const data = await fs.readFile("./endpoints.json", "utf-8");
    res.status(200).send(JSON.parse(data));
  } catch (err) {
    next(err);
  }
};
