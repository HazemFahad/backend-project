const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const fs = require("fs/promises");

beforeEach(() => seed(testData));
afterAll(() => db.end());

/* ***************GET TOPICS****************/

describe("GET /api/topics returns all topics", () => {
  test("endpoint returns array of topics with both description and slug", async () => {
    const results = await request(app).get("/api/topics").expect(200);
    expect(results.body).toEqual({
      topics: [
        {
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        },
        {
          description: "Not dogs",
          slug: "cats",
        },
        {
          description: "what books are made of",
          slug: "paper",
        },
      ],
    });
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app).get("/api/wrongEndpoint").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});

/* ***************GET ARTICLE BY ID****************/

describe("GET /api/articles/:article_id returns correct article", () => {
  test("endpoint returns correct article", async () => {
    const results = await request(app).get("/api/articles/10").expect(200);
    expect(results.body).toEqual({
      article: {
        article_id: 10,
        author: "rogersop",
        comment_count: 0,
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: "2020-05-14T04:15:00.000Z",
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        votes: 0,
      },
    });
  });
  test("returns 404 error if article number has no article", async () => {
    const results = await request(app).get("/api/articles/30").expect(404);
    expect(results.body).toEqual({
      msg: "An article with provided article ID does not exist",
    });
  });
  test("returns 400 error if article number is non-number", async () => {
    const results = await request(app).get("/api/articles/cheese").expect(400);
    expect(results.body.msg).toBe("Bad Request");
  });
  test("returns 404 error if endpoint not found", async () => {
    const results = await request(app).get("/api/article/2").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});

/* ***************GET ARTICLE BY ID WITH COMMENT COUNT****************/

describe("GET /api/articles/:article_id returns correct article with comment count", () => {
  test("endpoint returns correct article with comment count", async () => {
    const results = await request(app).get("/api/articles/1").expect(200);
    expect(results.body.article.comment_count).toBe(11);
  });
});

/* ***************PATCH ARTICLE****************/

describe("PATCH /api/articles/:article_id ", () => {
  test("votes on requested article are updated and returned", async () => {
    const results = await request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 1 });
    expect(results.body.article.votes).toEqual(1);
  });
  test("votes on requested article are updates and returned", async () => {
    const results = await request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 1100 })
      .expect(200);
    expect(results.body.article.votes).toEqual(1100);
  });
  test("votes on requested article are updates and returned - works for negative numbers", async () => {
    const results = await request(app)
      .patch("/api/articles/6")
      .send({ inc_votes: -10 });
    expect(results.body.article.votes).toEqual(-10);
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app)
      .patch("/api/article/6")
      .send({ inc_votes: -10 })
      .expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app)
      .patch("/api/article/banana")
      .send({ inc_votes: -10 })
      .expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
  test("returns 404 error if article ID not found", async () => {
    const results = await request(app)
      .patch("/api/articles/46")
      .send({ inc_votes: -10 })
      .expect(404);
    expect(results.body).toEqual({
      msg: "An article with provided article ID does not exist",
    });
  });
  test("returns 400 with invalid inc_votes", async () => {
    const results = await request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "D" })
      .expect(400);
    expect(results.body.msg).toBe("Bad Request");
  });
});

/* ***************GET ARTICLE DESC DATE****************/

describe("GET /api/articles returns all articles in descending order", () => {
  test("endpoint returns array of articles in descending order", async () => {
    const results = await request(app).get("/api/articles").expect(200);
    expect(results.body.article).toBeSortedBy("created_at", {
      descending: true,
    });
  });
  test("endpoint returns array of articles with comment count", async () => {
    const results = await request(app).get("/api/articles").expect(200);
    expect(
      results.body.article.map((article) => article.comment_count)
    ).toEqual([2, 1, 0, 0, 2, 11, 2, 0, 0, 0, 0, 0]);
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app).get("/api/arrtcles").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});

/* ***************GET /api/articles (queries)****************/

describe("GET /api/articles returns articles with correct queries applied ", () => {
  test("endpoint returns array of articles filtered by topic", async () => {
    const results = await request(app)
      .get("/api/articles?topic=mitch")
      .expect(200);
    expect(
      results.body.article.map((article) => {
        return article.topic;
      })
    ).toEqual([
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
      "mitch",
    ]);
  });
  test("endpoint returns array of articles filtered by topic and sorted by comment count with default desc order", async () => {
    const results = await request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count")
      .expect(200);
    expect(results.body.article).toBeSortedBy("comment_count", {
      descending: true,
    });
  });
  test("endpoint returns array of articles filtered by topic and sorted by comment count with requested ASC order", async () => {
    const results = await request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count&order=asc")
      .expect(200);
    expect(results.body.article).toBeSortedBy("comment_count", {
      ascending: true,
    });
  });
  test("endpoint returns array of articles sorted by articleID with requested ASC order - IE topic not required to work", async () => {
    const results = await request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200);
    expect(results.body.article).toBeSortedBy("article_id", {
      ascending: true,
    });
  });
  test("returns 400 error if sort-by column does not exist", async () => {
    const results = await request(app)
      .get("/api/articles?sort_by=cheese&order=asc")
      .expect(400);
    expect(results.body).toEqual({
      msg: "Bad Request - Invalid Sort-By",
    });
  });
  test("endpoint returns empty array if articles filtered by topic which has no articles", async () => {
    const results = await request(app)
      .get("/api/articles?topic=paper&sort_by=comment_count&order=asc")
      .expect(200);
    expect(results.body).toEqual({
      article: [],
    });
  });
  test("returns 400 error if provided invalid order", async () => {
    const results = await request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count&order=cheese")
      .expect(400);
    expect(results.body).toEqual({
      msg: "Bad Request - Invalid order",
    });
  });
  test("returns 404 error if topic does not exist", async () => {
    const results = await request(app)
      .get("/api/articles?topic=cheese")
      .expect(404);
    expect(results.body).toEqual({
      msg: "Not Found - Topic Not Found",
    });
  });
});

/* ***************GET USERS****************/

describe("GET /api/users", () => {
  test("endpoint returns array of topics with both description and slug", async () => {
    const results = await request(app).get("/api/users").expect(200);
    expect(results.body).toEqual({
      users: [
        { username: "butter_bridge" },
        { username: "icellusedkars" },
        { username: "rogersop" },
        { username: "lurker" },
      ],
    });
  });

  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app).get("/api/usirs").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});

/* ***************GET COMMENTS FOR EACH ARTICLE BY ID****************/

describe("GET /api/articles/:article_id/comments returns all comments for given article", () => {
  test("endpoint returns array of comments for given article", async () => {
    const results = await request(app)
      .get("/api/articles/3/comments")
      .expect(200);
    expect(results.body).toEqual({
      comments: [
        {
          comment_id: 10,
          body: "git push origin master",
          article_id: 3,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-06-20T07:24:00.000Z",
        },
        {
          comment_id: 11,
          body: "Ambidextrous marsupial",
          article_id: 3,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-09-19T23:10:00.000Z",
        },
      ],
    });
  });
  test("returns empty comment array if there are no comments for existing article", async () => {
    const results = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(results.body).toEqual({
      comments: [],
    });
  });
  test("returns 404 error if article ID not found", async () => {
    const results = await request(app)
      .get("/api/articles/38/comments")
      .expect(404);
    expect(results.body).toEqual({
      msg: "A article with provided article_ID does not exist",
    });
  });
  test("returns 400 error if article number is non-number", async () => {
    const results = await request(app)
      .get("/api/articles/cheese/comments")
      .expect(400);
    expect(results.body.msg).toBe("Bad Request");
  });
});

/* ***************POST COMMENTS FOR EACH ARTICLE BY ID****************/

describe("POST /api/articles/:article_id/comments returns new comment added to comment table", () => {
  test("returns new comment added to comment table", async () => {
    const results = await request(app)
      .post("/api/articles/2/comments")
      .expect(201)
      .send({ username: "Hazem", body: "NC 4 Life" });

    expect(results.body.newComment.author).toBe("Hazem");
    expect(results.body.newComment.body).toBe("NC 4 Life");
    expect(results.body.newComment.article_id).toBe(2);
    expect(results.body.newComment.comment_id).toBe(19);
    expect(results.body.newComment.votes).toBe(0);
  });

  test("returns 404 error if article ID not found", async () => {
    const results = await request(app)
      .post("/api/articles/88/comments")
      .send({ username: "Hazem", body: "NC 4 Life" })
      .expect(404);
    expect(results.body).toEqual({
      msg: "A article with provided article_ID does not exist",
    });
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app)
      .post("/api/articles/88/commments")
      .send({ username: "Hazem", body: "NC 4 Life" })
      .expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
  test("returns 400 error if article number is non-number", async () => {
    const results = await request(app)
      .post("/api/articles/cheese/comments")
      .send({ username: "Hazem", body: "NC 4 Life" })
      .expect(400);
    expect(results.body.msg).toBe("Bad Request");
  });
});

/* ***************DELETE COMMENTS BY ID****************/

describe("DELETE /api/comments/:comment_id deletes comment from table and returns no content", () => {
  test("returns 204 & returns no content", async () => {
    const results = await request(app).delete("/api/comments/4").expect(204);
  });
  test("returns 404 if invalid comment_id", async () => {
    const results = await request(app).delete("/api/comments/400").expect(404);
    expect(results.body.msg).toBe(
      "A comment with provided comment_ID does not exist"
    );
  });
});

/* ***************GET API RETURNS ENDPOINTS ****************/

describe("GET /api", () => {
  test("returns 200 & object of all endpoints", async () => {
    const results = await request(app).get("/api").expect(200);
    const data = await fs.readFile("./endpoints.json", "utf-8");
    expect(results.body).toEqual(JSON.parse(data));
  });

  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app).get("/apa").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});
