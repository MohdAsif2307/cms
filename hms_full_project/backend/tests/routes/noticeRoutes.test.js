const request = require("supertest");
const { app } = require("../../server");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");

describe("Notice API (with Auth)", () => {
  let token;
  beforeAll(async () => {
    const admin = await User.create({
      _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
      name: "Admin User",
      email: "admin@test.com",
      passwordHash: "hashed123",
      role: "admin"
    });
    token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET || "devsecret");
  });

  it("should create a notice", async () => {
    const res = await request(app)
      .post("/api/notices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Maintenance Notice",
        body: "Hostel will be closed for maintenance this weekend.", // ✅ fixed field name
        author: "Admin User"
      });
    console.log("Notice API =>", res.statusCode, res.body);
    expect([200, 201]).toContain(res.statusCode);
  });
});
