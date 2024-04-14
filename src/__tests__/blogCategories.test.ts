import supertest from "supertest";
import { app } from "../app";
import CategoryService from "../services/blogCategoryService.ts";
import mongoose from "mongoose";
import { Category } from "../models/blogCategories.ts";


export const request = supertest(app);

const user = {
  fullname: "Test User",
  username: "test",
  email: "ndevulion@gmail.com",
  password: "@K1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

let BlogID1 = 'Ndevu';

let token: string;
let userId: string;
let CategoryServiceID: string;

beforeAll(async () => {
  await CategoryService.deletemany();
},  100000);

// Test signup feature/functionality
describe("POST /api/CategoryService", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new CategoryService post", async () => {
        const res = await request
            .post("/api/blog/CategoryService/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: BlogID1,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("CategoryService created");
        expect(res.body.data).toBeDefined();
        CategoryServiceID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/blog/CategoryService/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: BlogID1,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("CategoryService already exists");
    });
});

describe("GET /api/blog/CategoryService/:CategoryServiceID", () => {
    test("should retrieve a single CategoryService post", async () => {
      const newCategoryServicedata = {
        name: "Technology",
      };
      await Category.insertMany(newCategoryServicedata);

      const res = await request.get(`/api/blog/CategoryService/${CategoryServiceID}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("CategoryService retrieved successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should return CategoryService not found ,CategoryService id doesn't exist", async () => {
      const res = await request.get(`/api/blog/CategoryService/65f3134a494934b10177c062`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("CategoryService not found");
    });
});

describe("GET /api/blog/CategoryService/all", () => {
  test("should retrieve all blog CategoryServices", async () => {
    const res = await request.get("/api/blog/CategoryService/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All CategoryServices retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/blog/CategoryService/update/:CategoryServiceID", () => {
  test("should update the CategoryService", async () => {
    const res = await request
      .patch(`/api/blog/CategoryService/update/${CategoryServiceID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Elisa"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("CategoryService updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing CategoryService", async () => {
    const res = await request
      .patch(`/api/blog/CategoryService/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Elion"
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("blog CategoryService not found");
  });
});

describe("DELETE /api/blog/CategoryService/delete/:CategoryServiceID", () => {
  test("should delete to a CategoryService", async () => {
    const res = await request
      .delete(`/api/blog/CategoryService/delete/${CategoryServiceID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("CategoryService deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing CategoryService", async () => {
    const res = await request
      .delete(`/api/blog/CategoryService/delete/${CategoryServiceID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("CategoryService not found");
  });
});
