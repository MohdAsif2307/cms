// Database/db.js
require("dotenv").config();
const mongoose = require("mongoose");
console.log("DEBUG: process.env.MONGO_URI =", process.env.MONGO_URI); // 👈 add this
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cms";

/**
 * Connect to MongoDB using Mongoose.
 * Ensures a single, reusable connection.
 */
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

module.exports = connectToMongo;
