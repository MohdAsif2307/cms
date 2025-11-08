const Notice = require("../../models/Notice");

describe("Notice Model", () => {
  it("should save a notice with title and content", async () => {
    const notice = new Notice({ title: "Holiday", content: "Hostel will be closed on Diwali." });
    const saved = await notice.save();
    expect(saved.title).toBe("Holiday");
  });
});
