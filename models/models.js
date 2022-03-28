const db = require("../db/connection");

exports.getTopics = async () => {
  const results = await db.query("SELECT * FROM topics");
  return results.rows;
};
