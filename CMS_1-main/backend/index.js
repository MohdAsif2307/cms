// index.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectToMongo = require("./Database/db");

const app = express();

// --- Connect MongoDB ---
connectToMongo();

// --- Middleware ---
app.use(cors({ origin: process.env.FRONTEND_API_LINK || "*" }));
app.use(express.json());
app.use("/media", express.static(path.join(__dirname, "media")));

// --- Routes ---
app.get("/", (req, res) => res.send("CMS Backend Running 🚀"));
app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));
app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));
// SSO helper route
app.use('/api/sso', require('./routes/sso.route'));

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- Server startup ---
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 4000;
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Handle port already in use
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const newPort = Number(port) + 1;
      console.warn(`⚠️ Port ${port} busy. Retrying on ${newPort}...`);
      app.listen(newPort, () =>
        console.log(`Server running on port ${newPort}`)
      );
    } else {
      console.error("Server error:", err);
    }
  });
}

// --- Export for testing ---
module.exports = app;
