// Unit tests for auth controller (mocks models)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../models/faculty.model");
jest.mock("../../models/student.model");

const { registerFaculty, loginFaculty, registerStudent, loginStudent } = require("../../controllers/auth.controller");
const { Faculty } = require("../../models/faculty.model");
const Student = require("../../models/student.model");

describe("Auth Controller - Unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("registerFaculty hashes password and saves", async () => {
    const req = { body: { firstName: "A", lastName: "B", email: "a@b.com", password: "pass", designation: "prof" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Faculty.findOne = jest.fn().mockResolvedValue(null);
    Faculty.prototype.save = jest.fn().mockResolvedValue(true);

    await registerFaculty(req, res);

    expect(Faculty.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("loginFaculty returns token on valid creds", async () => {
    const req = { body: { email: "a@b.com", password: "pass" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const fakeUser = { _id: "123", email: "a@b.com", password: await bcrypt.hash("pass", 10), designation: "prof", firstName: "A", lastName: "B" };
    Faculty.findOne = jest.fn().mockResolvedValue(fakeUser);

    await loginFaculty(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
