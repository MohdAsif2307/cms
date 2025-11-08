const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { requireAuth, requireRole } = require("../middleware/auth");

// ✅ POST /api/rooms - Create new room (admin only)
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { number, capacity } = req.body;
    const room = await Room.create({ number, capacity });
    return res.status(201).json(room);
  } catch (err) {
    console.error("Room creation error:", err);
    res.status(500).json({ message: "Error creating room" });
  }
});

module.exports = router;
