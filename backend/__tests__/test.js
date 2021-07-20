const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;

const databaseName = "noGoogleAuthTestDB";

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      storageEngine: "wiredTiger",
    },
  });
  await mongoose.connect(mongoServer.getUri() + databaseName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await removeAllCollections();
});

const User = require("../models/user.model");

it("checks if Jest works", () => {
  expect(1).toBe(1);
});

describe("/api/check-availability endpoint", () => {
  it("gets error if both the username and email missing", async () => {
    const response = await request.get("/api/check-availability");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username or email required");
  });

  it("gets OK if username is available", async () => {
    const response = await request.get("/api/check-availability?username=asd");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("OK");
  });

  it("gets error if username already in use", async () => {
    await request.post("/api/signup").send({
      username: "asd",
      email: "asd@asd.asd",
      password: "asd",
    });

    const response = await request.get("/api/check-availability?username=asd");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already in use");
  });
});

describe("/api/signup endpoint", () => {
  it("puts the user in the db after signup with the given username and email", async () => {
    // given
    const formData = {
      username: "asd",
      email: "asd@asd.asd",
      password: "asd",
    };

    // when
    const response = await request.post("/api/signup").send(formData);

    // then
    const user = await User.findOne({});
    expect(user.username).toBe(formData.username);
    expect(user.email).toBe(formData.email);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signed up successfully! Check your email to continue.");
  });

  it("checks if after 2 signups there are 2 users in the db", async () => {
    // given
    await request.post("/api/signup").send({
      username: "asd",
      email: "asd@asd.asd",
      password: "asd",
    });

    await request.post("/api/signup").send({
      username: "asd2",
      email: "asd2@asd.asd",
      password: "asd2",
    });

    // when
    const users = await User.find({});

    // then
    expect(users.length).toBe(2);
  });

  it("gets error if try to signup with space in the username", async () => {
    const formData = {
      username: "asd asd",
      email: "asd@asd.asd",
      password: "asd",
    };

    const response = await request.post("/api/signup").send(formData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username must be alphanumeric and between 1-32 characters");
  });

  it("gets error if username already in use", async () => {
    const formData = {
      username: "asdasd",
      email: "asd@asd.asd",
      password: "asd",
    };

    await request.post("/api/signup").send(formData);
    const response = await request.post("/api/signup").send(formData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already in use");
  });

  it("gets error if email already in use", async () => {
    const formData1 = {
      username: "asd1",
      email: "asd@asd.asd",
      password: "asd",
    };

    const formData2 = {
      username: "asd2",
      email: "asd@asd.asd",
      password: "asd",
    };

    await request.post("/api/signup").send(formData1);
    const response = await request.post("/api/signup").send(formData2);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already in use");
  });
});
