import supertest from "supertest";
import { app } from "../app";
// import { User } from "../models/user";
import mongoose from "mongoose";
// import reset from "../controllers/reset";

export const request = supertest(app);

let token: string;

const user = {
  fullName: "Test User",
  username: "test",
  email: "elisandevu@gmail.com",
  password: "PassKey433Pass2345",
  phoneNumber: "0785044398",
  role: "admin",
};

const user1 = {
  username: "Ndevu12",
  password: "hellojbcKN78",
  fullName: "hello",
  email: "jeanjdhfpaulm@gmail.com",
  phoneNumber: "0785044398",
};

const loginUser = {
  username: "test",
  password: "PassKey433Pass2345",
};

// Startin gpoint
describe("api/user", () => {
  beforeAll(async () => {
    // reset.resetSetting();

    try {
      const res = await request.post("/api/user/create").send(user);
      if (res.statusCode !== 201) {
        throw new Error("Failed to create user");
      }
      token = res.body.data.accessToken;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }, 200000);

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /api/user/signup", () => {
    test("should not create duplicate users", async () => {
      const res = await request.post("/api/user/signup").send(user1);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        "Username, password or email already exists"
      );
    });
  });

  describe("POST /api/user/login", () => {
    test("should not login user with incorrect username", async () => {
      const res = await request
        .post("/api/user/login")
        .send({ username: "userName", password: "PassKey433Pass2345" });
      expect(res.statusCode).toBe(400);
    });

    test("should not login user with incorrect password", async () => {
      const res = await request
        .post("/api/user/login")
        .send({ username: "test", password: "@incorrectpassword1" });
      expect(res.statusCode).toBe(400);
    });

    test("should return authentication token on successful login", async () => {
      const res = await request.post("/api/user/login").send(loginUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    test("should not login user with invalid formatted or empty email or password", async () => {
      const res = await request
        .post("/api/user/login")
        .send({ username: "", password: "" });
      expect(res.statusCode).toBe(404);
    });
  });
});
