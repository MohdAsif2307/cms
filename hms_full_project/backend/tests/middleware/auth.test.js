const jwt = require("jsonwebtoken");
const { requireAuth, requireRole } = require("../../middleware/auth");
const User = require("../../models/User");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: { authorization: null }, user: null };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("should return 401 if no token is provided", async () => {
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token" });
  });

  it("should return 401 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalidtoken";
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("should call next() if token is valid and user exists", async () => {
    const mockUser = { _id: "123", role: "student" };
    req.headers.authorization = "Bearer validtoken";
    jest.spyOn(jwt, "verify").mockReturnValue({ id: "123" });
    jest.spyOn(User, "findById").mockResolvedValue(mockUser);

    await requireAuth(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it("should block access for wrong role", async () => {
    req.user = { role: "student" };
    const middleware = requireRole("admin");
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
  });

  it("should allow access for correct role", async () => {
    req.user = { role: "admin" };
    const middleware = requireRole("admin");
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
