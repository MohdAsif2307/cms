Test Suite for CMS Backend
==========================

What you get:
- __tests__/unit  -> unit test templates (controller-level)
- __tests__/integration -> integration test templates (routes using in-memory MongoDB)
- jest.config.js -> Jest configuration
- README explains setup and required changes.

IMPORTANT BEFORE RUNNING TESTS
------------------------------
1. Modify your backend's index.js to export the Express app without immediately starting
   the server when in test mode. Edit index.js like this:

   require("dotenv").config();
   const express = require("express");
   const cors = require("cors");
   const path = require("path");
   const connectToMongo = require("./Database/db");

   const app = express();
   app.use(cors({ origin: process.env.FRONTEND_API_LINK || "*" }));
   app.use(express.json());
   app.use("/media", express.static(path.join(__dirname, "media")));

   // ... register routes ...
   app.use("/api/faculty", require("./routes/details/faculty-details.route"));
   // other routes...

   // connect only when not testing, or let tests control DB connection
   if (process.env.NODE_ENV !== "test") {
     connectToMongo();
     const port = process.env.PORT || 4000;
     app.listen(port, () => console.log(`Server running on port ${port}`));
   }

   module.exports = app;

   NOTE: Tests assume `module.exports = app` exists.

2. Install dev dependencies:
   npm install --save-dev jest supertest mongodb-memory-server @types/jest

   And runtime deps if missing:
   npm install --save-dev jest supertest mongodb-memory-server

3. Add test script to package.json:
   "scripts": {
     "test": "NODE_ENV=test jest --runInBand"
   }

4. Tests mock out nodemailer and avoid sending real emails. Make sure your mail util can be mocked
   (common pattern: require nodemailer in utils/SendMail.js) and tests will auto-mock it.

How the tests work:
- Unit tests mock Mongoose models so they don't touch DB.
- Integration tests spin up an in-memory MongoDB (mongodb-memory-server), connect mongoose to it,
  and run HTTP requests against your Express app using Supertest.

If you want, I can patch your index.js and Database/db.js automatically — paste those files and I will modify them.
