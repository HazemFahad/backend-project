const db = require("../db/connection");

exports.getTopics = async () => {
  const results = await db.query("SELECT * FROM topics");
  return results.rows;
};

exports.getArticle = async (articleID) => {
  const queryString = `
    SELECT * FROM articles 
    WHERE article_id = $1;
    `;

  const value = [articleID];
  const result = await db.query(queryString, value);

  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "An article with provided article ID does not exist",
    });
  }

  return result.rows[0];
};

exports.updateVotes = async (articleID, voteNum) => {
  const queryString = `
  UPDATE articles 
  SET votes = votes + $1 
  WHERE article_id = $2 
  RETURNING *;
  `;

  const values = [voteNum, articleID];
  const result = await db.query(queryString, values);

  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "An article with provided article ID does not exist",
    });
  }

  return result.rows[0];
};
