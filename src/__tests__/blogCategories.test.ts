import supertest from "supertest";
import { app } from "../app";
import { BlogCategory } from "../models/blogCategories.ts";

const blogCategory = new BlogCategory();

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
let blogCategoryID: string;

beforeAll(async () => {
  await blogCategory.deletemany();
});

// Test signup feature/functionality
describe("POST /api/blogCategory", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new blogCategory post", async () => {
        const res = await request
            .post("/api/blog/Category/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: BlogID1,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("blogCategory created");
        expect(res.body.data).toBeDefined();
        blogCategoryID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/blog/Category/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: BlogID1,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("blogCategory already exists");
    });
});

describe("GET /api/blog/Category/:blogCategoryID", () => {
    test("should retrieve a single blogCategory post", async () => {
        const newblogCategorydata = {
            name: BlogID1,
        };
        await blogCategory.createBlogCategory(newblogCategorydata);
        const res = await request.get(`/api/blog/Category/${blogCategoryID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("blogCategory retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return blogCategory not found ,blogCategory id doesn't exist", async () => {
        const res = await request.get(`/api/blog/Category/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("blogCategory not found");
    });
});

describe("GET /api/blog/Category/all", () => {
  test("should retrieve all blog Categorys", async () => {
    const res = await request.get("/api/blog/Category/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All blogCategorys retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/blog/Category/update/:blogCategoryID", () => {
  test("should update the blogCategory", async () => {
    const res = await request
      .patch(`/api/blog/Category/update/${blogCategoryID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Elisa"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("blogCategory updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing blogCategory", async () => {
    const res = await request
      .patch(`/api/blog/Category/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Elion"
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("blog Category not found");
  });
});

describe("DELETE /api/blog/Category/delete/:blogCategoryID", () => {
  test("should delete to a blogCategory", async () => {
    const res = await request
      .delete(`/api/blog/Category/delete/${blogCategoryID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("blogCategory deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing blogCategory", async () => {
    const res = await request
      .delete(`/api/blog/Category/delete/${blogCategoryID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("blogCategory not found");
  });
});
