const db = require("../db/connection");

/* ***************CHECK ARTICLE EXISTS****************/

exports.checkArticleExists = async (articleID) => {
  const articleQuery = `
    SELECT *
    FROM articles 
    WHERE article_id = $1
    `;

  const articleResult = await db.query(articleQuery, [articleID]);

  if (articleResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "An article with provided article ID does not exist",
    });
  }
};

/* ***************GET TOPICS****************/

exports.getTopics = async () => {
  const results = await db.query("SELECT * FROM topics;");
  return results.rows;
};

/* ***************GET ARTICLE BY ID****************/

exports.fetchArticles = async (articleID) => {
  const value = [];

  let articleQuery = `
    SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

  if (articleID) {
    articleQuery += `WHERE articles.article_id = $1`;

    value.push(articleID);
  }

  articleQuery += "GROUP BY articles.article_id ORDER BY created_at DESC;";

  const result = await db.query(articleQuery, value);

  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "An article with provided article ID does not exist",
    });
  }
  if (articleID) {
    return result.rows[0];
  }
  return result.rows;
};

/* ***************PATCH ARTICLE****************/

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

/* ***************GET USERS****************/

exports.getAllUsers = async () => {
  const queryString = `
  SELECT username FROM users;
   `;

  const result = await db.query(queryString);

  return result.rows;
};

/* ***************GET COMMENTS FOR EACH ARTICLE BY ID****************/

exports.fetchCommentsForArticle = async (articleID) => {
  const commentQuery = `
    SELECT *
    FROM comments 
    WHERE article_id = $1
    `;

  const commentResult = await db.query(commentQuery, [articleID]);

  return commentResult.rows;
};

/* ***************POST COMMENTS FOR EACH ARTICLE BY ID****************/

exports.addCommentToArticle = async (articleID, username, body) => {
  const userValue = [username, username];
  const userUpdate = `  
  INSERT INTO users (name, username) 
  VALUES ($1, $2);`;
  const userResult = await db.query(userUpdate, userValue);

  const commentValue = [body, articleID, username, 0];
  const commentUpdate = `
  INSERT INTO comments (body, article_id, author, votes) 
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

  const commentResult = await db.query(commentUpdate, commentValue);

  return commentResult.rows[0];
};
