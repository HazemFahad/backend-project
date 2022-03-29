const res = require("express/lib/response");
const { getTopics, getArticle, updateVotes } = require("../models/models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await getTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const article = await getArticle(articleID);
    res.status(200).send({ article }); ///do this for rest
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const articleID = req.params.article_id;
    const voteNum = req.body.inc_votes;

    const article = await updateVotes(articleID, voteNum);
    res.status(200).send({ article }); ///do this for rest
  } catch (err) {
    next(err);
  }
};
