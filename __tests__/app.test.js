const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics returns all topics", () => {
  test("endpoint returns array of topics with both description and slug", async () => {
    const results = await request(app).get("/api/topics").expect(200);
    expect(results.body).toEqual([
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
    ]);
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app).get("/api/wrongEndpoint").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});
describe("GET /api/articles/:article_id returns correct article", () => {
  test("endpoint returns correct article", async () => {
    const results = await request(app).get("/api/articles/10").expect(200);
    expect(results.body).toEqual({
      article_id: 10,
      author: "rogersop",
      body: "Who are we kidding, there is only one, and it's Mitch!",
      created_at: "2020-05-14T04:15:00.000Z",
      title: "Seven inspirational thought leaders from Manchester UK",
      topic: "mitch",
      votes: 0,
    });
  });
  test("endpoint returns correct article", async () => {
    const results = await request(app).get("/api/articles/3").expect(200);
    expect(results.body).toEqual({
      article_id: 3,
      author: "icellusedkars",
      body: "some gifs",
      created_at: "2020-11-03T09:12:00.000Z",
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      votes: 0,
    });
  });
  test("returns 404 error if article number has no article", async () => {
    const results = await request(app).get("/api/articles/30").expect(404);
    expect(results.body).toEqual({
      msg: "An article with provided article ID does not exist",
    });
  });
  test("returns 404 error if article number is non-number", async () => {
    const results = await request(app).get("/api/articles/cheese").expect(404);
    expect(results.body).toEqual({
      msg: "An article with provided article ID does not exist",
    });
  });
  test("returns 404 error if endpoint incorrectly inputted", async () => {
    const results = await request(app).get("/api/article/2").expect(404);
    expect(results.body).toEqual({
      msg: "Page not Found",
    });
  });
});
describe("PATCH /api/articles/:article_id ", () => {
  test("votes on requested article are updates and returned", async () => {
    const results = await request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 1 });
    expect(results.body.votes).toEqual(1);
  });
  test("votes on requested article are updates and returned", async () => {
    const results = await request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 1100 });
    expect(results.body.votes).toEqual(1100);
  });
  test("votes on requested article are updates and returned - works for negative numbers", async () => {
    const results = await request(app)
      .patch("/api/articles/6")
      .send({ inc_votes: -10 });
    expect(results.body.votes).toEqual(-10);
  });
  test("returns 200 and functions correctly if inc_votes is sent as string ", async () => {
    const results = await request(app)
      .patch("/api/articles/6")
      .send({ inc_votes: "-10" });
    expect(results.body.votes).toEqual(-10);
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
  test("returns 404 error if article ID not valid", async () => {
    const results = await request(app)
      .patch("/api/articles/46")
      .send({ inc_votes: -10 })
      .expect(404);
    expect(results.body).toEqual({
      msg: "An article with provided article ID does not exist",
    });
  });
  test("returns 200 but does not change the vote count if non number inputted into inc_votes", async () => {
    const results = await request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "D" })
      .expect(200);
    expect(results.body).toEqual({
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: "2020-11-03T09:12:00.000Z",
      votes: null,
    });
  });
});
