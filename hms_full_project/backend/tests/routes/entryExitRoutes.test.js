const request = require("supertest");
const { app } = require("../../server");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");

describe("EntryExit API (with Auth)", () => {
  let token;
  beforeAll(async () => {
    const testUser = await User.create({
      _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
      name: "Test Student2",
      email: "student2@test.com",
      passwordHash: "hashed123", // ✅ fixed
      role: "student"
    });
    token = jwt.sign({ id: testUser._id, role: "student" }, process.env.JWT_SECRET || "devsecret");
  });

  it("should log an entry", async () => {
    const res = await request(app)
      .post("/api/entry")
      .set("Authorization", `Bearer ${token}`)
      .send({ studentId: "507f1f77bcf86cd799439013", type: "entry" });
    console.log("EntryExit API =>", res.statusCode);
    expect([200, 201]).toContain(res.statusCode);
  });
});
