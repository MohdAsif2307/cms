const mongoose = require("mongoose");
const EntryExit = require("../../models/EntryExit");

describe("EntryExit Model", () => {
  it("should record an entry log", async () => {
    const studentId = new mongoose.Types.ObjectId(); // ✅ dummy ObjectId
    const entry = new EntryExit({
      student: studentId,
      type: "entry",
      timestamp: new Date()
    });
    const saved = await entry.save();
    expect(saved.student).toEqual(studentId);
    expect(saved.type).toBe("entry");
  });
});
