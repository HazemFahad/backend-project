const db = require("../db/connection");

//////////////////////////// CHECK FUNCTION ////////////////////////////

/* ***************CHECK ARTICLE EXISTS****************/

exports.checkSomethingExists = async (id, parent, child) => {
  const query = `
    SELECT *
    FROM ${parent} 
    WHERE ${child} = $1
    `;

  const result = await db.query(query, [id]);

  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `A ${child} with provided ID does not exist`,
    });
  }
};

exports.checkSomethingExistsNoReject = async (id, parent, child) => {
  const query = `
    SELECT *
    FROM ${parent} 
    WHERE ${child} = $1
    `;

  const result = await db.query(query, [id]);

  if (result.rows.length === 0) {
    return true;
  }
  return false;
};

exports.addNewThing = async (
  table,
  col1Name,
  thingToAdd1,
  col2Name,
  thingToAdd2
) => {
  const Value = [thingToAdd1, thingToAdd2];
  const Update = `  
  INSERT INTO ${table} (${col1Name}, ${col2Name}) 
  VALUES ($1, $2);`;
  const Result = await db.query(Update, Value);
};

//////////////////////////// TOPICS ////////////////////////////

/* ***************GET TOPICS****************/

exports.getTopics = async () => {
  const results = await db.query("SELECT * FROM topics;");
  return results.rows;
};

//////////////////////////// ARTICLE ////////////////////////////

/* ***************GET ARTICLE BY ID****************/

exports.fetchArticles = async (
  articleID,
  sort_by = "created_at",
  order = "desc",
  topic,
  allTopics
) => {
  const value = [];

  const validOrder = ["asc", "desc"];

  if (validOrder.indexOf(order) === -1) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request - Invalid order",
    });
  }
  const validSortBy = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_id",
    "comment_count",
  ];
  if (validSortBy.indexOf(sort_by) === -1) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request - Invalid Sort-By",
    });
  }

  let articleQuery = `
    SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

  if (articleID) {
    articleQuery += `WHERE articles.article_id = $1`;

    value.push(articleID);
  }

  if (topic) {
    const TopicSlugList = allTopics.map((topic) => topic.slug);

    if (TopicSlugList.indexOf(topic) === -1) {
      return Promise.reject({
        status: 404,
        msg: "Not Found - Topic Not Found",
      });
    }

    articleQuery += `WHERE articles.topic = $1`;
    value.push(topic);
  }

  articleQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  const result = await db.query(articleQuery, value);

  if (!topic && result.rows.length === 0) {
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

/* ***************POST ARTICLE****************/

exports.addArticle = async (title, topic, author, body, votes = 0) => {
  const articleQuery = `
  INSERT INTO articles (title, topic, author, body, votes) 
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `;
  const articleValue = [title, topic, author, body, votes];

  const commentResult = await db.query(articleQuery, articleValue);

  return commentResult.rows[0].article_id;
};

//////////////////////////// USERS ////////////////////////////

/* ***************GET USERS****************/

exports.getAllUsers = async () => {
  const queryString = `
  SELECT username FROM users;
   `;

  const result = await db.query(queryString);

  return result.rows;
};

/* ***************GET USERS BY USERNAME****************/

exports.fetchUsersByUsername = async (username) => {
  const queryString = `
  SELECT * FROM users
  WHERE username = $1
   `;

  const result = await db.query(queryString, [username]);

  return result.rows[0];
};

//////////////////////////// COMMENTS ////////////////////////////

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
  const commentValue = [body, articleID, username, 0];
  const commentUpdate = `
  INSERT INTO comments (body, article_id, author, votes) 
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

  const commentResult = await db.query(commentUpdate, commentValue);

  return commentResult.rows[0];
};

/* ***************DELETE COMMENTS BY ID****************/

exports.removeComment = async (commentID) => {
  const deleteQuery = `
  DELETE 
  FROM comments 
  WHERE comment_id = $1
  `;
  const deleteResult = await db.query(deleteQuery, [commentID]);
};

/* ***************PATCH COMMENTS BY ID****************/

exports.editComment = async (commentID, voteNum) => {
  const commentQuery = `
  UPDATE comments
  SET votes = votes + $1  
  WHERE comment_id = $2
  RETURNING *
  `;
  const commentResult = await db.query(commentQuery, [voteNum, commentID]);

  return commentResult.rows[0];
};
