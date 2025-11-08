const User = require("../../models/User");

describe("User Model", () => {
  it("should create and save a user successfully", async () => {
    const userData = {
      name: "Ashish",
      email: "ashish@example.com",
      passwordHash: "hashed123"   // ✅ changed
    };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
  });
});
