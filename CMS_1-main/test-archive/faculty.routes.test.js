const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // set MONGO_URI for any DB connection logic
  process.env.MONGO_URI = uri;
  // require app after setting env
  app = require("../../index");
  // connect mongoose (if your app's DB connection isn't automatic in test mode)
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // clear db between tests
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

describe("Faculty Routes - Integration", () => {
  test("POST /api/faculty/register -> creates faculty", async () => {
    const res = await request(app)
      .post("/api/faculty/register")
      .send({
        firstName: "Test",
        lastName: "Fac",
        email: "testfac@example.com",
        password: "pass123",
        designation: "Professor"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBeTruthy();
  });

  test("POST /api/faculty/login -> returns token", async () => {
    // first register
    await request(app).post("/api/faculty/register").send({
      firstName: "Test",
      lastName: "Fac",
      email: "loginfac@example.com",
      password: "pass123",
      designation: "Professor"
    });

    const res = await request(app)
      .post("/api/faculty/login")
      .send({ email: "loginfac@example.com", password: "pass123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });
});
