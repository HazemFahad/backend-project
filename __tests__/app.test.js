const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const testData = require("../db/data/test-data/index");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("TEST1", () => {});
});
