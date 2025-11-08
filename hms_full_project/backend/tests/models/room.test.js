const Room = require("../../models/Room");

describe("Room Model", () => {
  it("should create a new room", async () => {
    const room = new Room({ roomNumber: "B12", capacity: 2, occupied: false }); // ✅ fixed
    const saved = await room.save();
    expect(saved.roomNumber).toBe("B12");
  });
});
