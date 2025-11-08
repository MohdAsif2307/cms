const mongoose = require("mongoose");
const Complaint = require("../../models/Complaint");

describe("Complaint Model", () => {
  it("should create and save a complaint", async () => {
    const studentId = new mongoose.Types.ObjectId();
    const complaint = new Complaint({
      student: studentId,
      description: "Room light not working",
      status: "pending",
    });
    const saved = await complaint.save();
    expect(saved.student).toEqual(studentId);
    expect(saved.status).toBe("pending");
  });
});
