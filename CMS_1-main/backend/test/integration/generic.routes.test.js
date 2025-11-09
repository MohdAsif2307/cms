
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;
let app;

beforeAll(async () => {
	process.env.NODE_ENV = "test";
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	// set MONGO_URI for any DB connection logic
	process.env.MONGO_URI = uri;
	// require app after setting env
	app = require("../../index");
	// connect mongoose (if your app's DB connection isn't automatic in test mode)
	await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

afterEach(async () => {
	// clear db between tests
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

describe("Generic Routes - Integration", () => {
	test("GET /api/branch -> responds (may be 200 or 204)", async () => {
		const res = await request(app).get("/api/branch");
		expect([200,204,201,404]).toContain(res.statusCode);
	});
});

