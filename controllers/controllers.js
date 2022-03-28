const res = require("express/lib/response");
const { getTopics } = require("../models/models");

exports.returnTopics = async (req, res, next) => {
  const results = await getTopics();
  res.send(results).status(200);
};
