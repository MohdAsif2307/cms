const request = require("supertest");
const { app } = require("../../server");

describe("User API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Ashish", email: "ashish@example.com", password: "12345" });
    expect(res.statusCode).toBe(201);
  });

  it("should login successfully", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Ashish", email: "ashish@example.com", password: "12345" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ashish@example.com", password: "12345" });
    expect(res.statusCode).toBe(200);
  });
});
