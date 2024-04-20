import supertest from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
// import reset from "../controllers/reset.";

export const request = supertest(app);

let messageId: string;

const user = {
  fullName: "Test User",
  username: "test",
  email: "ndevulion@gmail.com",
  password: "K1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

const author = {
  author: {
    name: "Hale",
    email: "haleywywirbch@gmail.com",
  },
};

let token: string;

// Startin gpoint
describe("api/message", () => {
  beforeAll(async () => {
    // reset.reseetting();
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

  describe("POST /api/message", () => {
    test("Should send a message", async () => {
      const messageData = {
        email: "jeanpaulelisan@gmail.com",
        message: "Hello, How can I reach out to you?",
      };

      const res = await request
        .post("/api/message/contactme")
        .set("Authorization", `Bearer ${token}`)
        .send(messageData);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Message sent!");
      expect(res.body.data).toBeDefined();
    });
  });
  describe("GET /api/message/", () => {
    test("Should Retrieve all messages", async () => {
      const res = await request
        .get("/api/message/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("All messages retrieved!");
      expect(res.body.data).toBeDefined();
    });

    test("Should get single message", async () => {
      const res = await request
        .get(`/api/message/662243000f0c48e9ae126d7f`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Message retrieved successfully");
      expect(res.body.data).toBeDefined();
    });
  });

  describe("DELETE /api/notification/delete/:LicenseID", () => {
    test("Should delete a message", async () => {
      const res = await request
        .delete(`/api/message/delete/6622a9d03b91fe6bf56ea631`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Message deleted successfully");
      expect(res.body.data).toBeDefined();
    });
  });
});
