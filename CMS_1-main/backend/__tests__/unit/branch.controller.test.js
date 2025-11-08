// Generic unit test template for controllers - replace model and controller paths accordingly
jest.mock("../../models/branch.model");

const { getBranches, createBranch } = require("../../controllers/branch.controller");
const Branch = require("../../models/branch.model");

describe("Branch Controller - Unit", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createBranch calls save and returns 201", async () => {
    const req = { body: { name: "CS" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Branch.findOne = jest.fn().mockResolvedValue(null);
    Branch.prototype.save = jest.fn().mockResolvedValue(true);

    await createBranch(req, res);

    expect(Branch.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
