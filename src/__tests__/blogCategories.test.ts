import supertest from "supertest";
import { app } from "../app";
// import category from "../services/blogCategoryService";
import mongoose from "mongoose";
import { Category } from "../models/blogCategories";
// import reset from "../controllers/reset";

export const request = supertest(app);

const categoryData = {
  name: "Mechanics",
};

let token: string;

describe("api/blogCategory", () => {
  beforeAll(async () => {
    // reset.resetSetting();
  }, 200000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // Test signup feature/functionality
  describe("POST /api/blogCategory", () => {
    test("create new category", async () => {
      const res = await request
        .post("/api/blogCategory/create")
        .send(categoryData);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("category created successful");
      expect(res.body.data).toBeDefined();
    });

    test("Don't create duplicate", async () => {
      const res = await request
        .post("/api/blogCategory/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Mechanics",
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Category already exists");
    });
  });

  describe("GET /api/blogCategory/:id", () => {
    test("should retrieve a single category", async () => {
      const newcategorydata = {
        name: "new blog Technology",
      };
      await Category.insertMany(newcategorydata);

      const res = await request.get(
        `/api/blogCategory/6622c3b0d2ec9e81782bf6e9`
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("category retrieved successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should return category not found ,category id doesn't exist", async () => {
      const res = await request.get(
        `/api/blogCategory/662242e7166fcbb45d294c49`
      );
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("category not found");
    });
  });

  describe("GET /api/blogCategory/", () => {
    test("should retrieve all blog categorys", async () => {
      const res = await request.get("/api/blogCategory/");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("All categorys retrieved!");
      expect(res.body.data).toBeDefined();
    });
  });
  describe("PUT /api/blogCategory/update/:id", () => {
    test("should update the category", async () => {
      const res = await request
        .put(`/api/blogCategory/update/6622c3b0d2ec9e81782bf6e9`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Hama Hamwe Elisa",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("category updated successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not update a non-existing category", async () => {
      const res = await request
        .put(`/api/blogCategory/update/662242e7166fcbb45d294c49`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Elion",
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("category not found");
    });
  });

  describe("DELETE /api/blogCategory/delete/:id", () => {
    test("should delete a category", async () => {
      const res = await request
        .delete(`/api/blogCategory/delete/6622c318d2ec9e81782bf6e3`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("category deleted successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not delete a non-existing category", async () => {
      const res = await request
        .delete(`/api/blogCategory/delete/662242e7166fcbb45d294c49`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("category not found");
    });
  });
});
