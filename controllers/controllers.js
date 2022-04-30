const fs = require("fs/promises");

const {
  getTopics,
  fetchArticles,
  updateVotes,
  getAllUsers,
  fetchCommentsForArticle,
  addCommentToArticle,
  checkSomethingExists,
  checkSomethingExistsNoReject,
  removeComment,
  fetchUsersByUsername,
  editComment,
  addNewThing,
  addArticle,
  getFullUsers,
} = require("../models/models");

//////////////////////////// TOPICS ////////////////////////////

/* ***************GET TOPICS****************/

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await getTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

//////////////////////////// ARTICLE ////////////////////////////

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

/* ***************POST ARTICLE****************/

exports.postArticle = async (req, res, next) => {
  try {
    const { body, author, title, topic } = req.body;

    const userCheck = await checkSomethingExistsNoReject(
      author,
      "users",
      "username"
    );

    if (userCheck) {
      const addUser = await addNewThing(
        "users",
        "name",
        author,
        "username",
        author
      );
    }

    const topicCheck = await checkSomethingExistsNoReject(
      topic,
      "topics",
      "slug"
    );

    if (topicCheck) {
      const addTopic = await addNewThing(
        "topics",
        "description",
        topic,
        "slug",
        topic
      );
    }

    const newArticle = await addArticle(title, topic, author, body);
    const returnArticle = await fetchArticles(newArticle);
    res.status(201).send({ article: returnArticle });
  } catch (err) {
    next(err);
  }
};

//////////////////////////// USERS ////////////////////////////

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

/* ***************GET FULL USERS ****************/

exports.getFullUserData = async (req, res, next) => {
  try {
    const users = await getFullUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

//////////////////////////// COMMENTS ////////////////////////////

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

    // const addUser = await addNewThing(
    //   "users",
    //   "name",
    //   username,
    //   "username",
    //   username
    // );

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

/* ***************PATCH COMMENTS BY ID****************/

exports.patchComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    const commentCheck = await checkSomethingExists(
      comment_id,
      "comments",
      "comment_id"
    );

    const updatedComment = await editComment(comment_id, inc_votes);
    res.status(200).send({ updatedComment });
  } catch (err) {
    next(err);
  }
};

//////////////////////////// JSON ENDPOINTS ////////////////////////////

/* ***************GET API RETURNS ENDPOINTS ****************/

exports.readFileAndSend = async (req, res, next) => {
  try {
    const data = await fs.readFile("./endpoints.json", "utf-8");
    res.status(200).send(JSON.parse(data));
  } catch (err) {
    next(err);
  }
};
