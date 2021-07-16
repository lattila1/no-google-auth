const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;

const User = require("../models/user.model");
const databaseName = "noGoogleAuthTestDB";

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri() + databaseName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

afterAll(async () => {
  mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await removeAllCollections();
});

it("checks if Jest works", () => {
  expect(1).toBe(1);
});

describe("/api/check-availabilty endpoint", () => {
  it("gets error if username or email isn't present", async () => {
    const response = await request.get("/api/check-availability");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username or email required");
  });
});

describe("/api/signup endpoint", () => {
  it("can signup", async () => {
    const response = await request.post("/api/signup").send({
      username: "asd",
      email: "asd@asd.asd",
      password: "asd",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signed up successfully! Check your email to continue.");
  });
});
