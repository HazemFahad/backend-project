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
  fetchUsersByUsername,
} = require("../models/models");

/* ***************GET TOPICS****************/

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await getTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

/* ***************GET ARTICLE ****************/

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

/* ***************PATCH ARTICLE****************/

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

/* ***************GET USERS****************/

exports.getUsernames = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

/* ***************GET USERNAME BY USERNAME****************/

exports.getUsersByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userCheck = await checkSomethingExists(username, "users", "username");
    const user = await fetchUsersByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

/* ***************GET COMMENTS FOR EACH ARTICLE BY ID****************/

exports.getCommentsForArticle = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const articleCheck = await checkSomethingExists(
      articleID,
      "articles",
      "article_id"
    );

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

    const articleCheck = await checkSomethingExists(
      articleID,
      "articles",
      "article_id"
    );

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
    const commentCheck = await checkSomethingExists(
      commentID,
      "comments",
      "comment_id"
    );

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
