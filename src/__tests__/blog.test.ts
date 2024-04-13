import supertest from "supertest";
import { app } from "../app";
import { BlogModel }  from "../models/Blog.ts";

// const blogModel = new BlogModel();

export const request = supertest(app);

const user = {
  fullname: "Test User",
  username: "test",
  email: "ndevulion@gmail.com",
  password: "@K1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

let token: string;
let userId: string;
let blogID: string;

beforeAll(async () => {
  await BlogModel.deleteAllBlogs();
});

// Test signup feature/functionality
describe("POST /api/Blog", () => {
  test("create an author", async () => {
    const res = await request.post("/api/user/signup").send(user);
    expect(res.statusCode).toBe(201); 
    expect(res.body.message).toBe("Signup successful");
    userId = res.body.data._id;
    token = res.body.data.accessToken;
    expect(res.body.data).toBeDefined();
  });

  test("create a new BlogModel post", async () => {
    const res = await request
      .post("/api/Blog/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test BlogModel",
        author: userId,
        description: "This is a test BlogModel post",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("BlogModel created");
    expect(res.body.data).toBeDefined();
    blogID = res.body.data._id;
  });
  test("Don't create duplicate", async () => {
    const res = await request
      .post("/api/Blog/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test BlogModel",
        author: userId,
        description: "This is a test BlogModel post",
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("BlogModel already exists");
  });
});

describe("GET /api/Blog/:blogID", () => {
  test("should retrieve a single BlogModel post", async () => {
    const newBlogdata = {
      title: "Test BlogModel 2",
      description: "This is another test BlogModel post",
      author: userId,
    };
    await BlogModel.createBlog(newBlogdata);
    const res = await request.get(`/api/Blog/${blogID}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("BlogModel retrieved successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should return BlogModel not found ,Blog id doesn't exist", async () => {
    const res = await request.get(`/api/Blog/65f3134a494934b10177c062`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Blog not found");
  });
});

describe("GET /api/Blog/all", () => {
  test("should retrieve all BlogModels", async () => {
    const res = await request.get("/api/Blog/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All BlogModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/Blog/update/:blogID", () => {
  test("should update the BlogModel", async () => {
    const res = await request
      .patch(`/api/Blog/update/${blogID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Title",
        description: "Update the description",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("BlogModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing BlogModel", async () => {
    const res = await request
      .patch(`/api/Blog/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Title",
        description: "Update the description",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("BlogModel not found");
  });
});

describe("PATCH /api/Blog/like/:blogID", () => {
  test("should like a BlogModel", async () => {
    const res = await request
      .patch(`/api/Blog/like/${blogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("BlogModel liked successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not like BlogModel two times", async () => {
    const res = await request
      .patch(`/api/Blog/like/${blogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("You have already liked this BlogModel");
  });
  test("should not like a non-existing BlogModel", async () => {
    const res = await request
      .patch(`/api/Blog/like/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("BlogModel not found");
  });
});

describe("POST /api/comment/add/:blogID", () => {
  test("should add comment to a BlogModel", async () => {
    const res = await request
      .post(`/api/comment/add/${blogID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: " Thanks this is very informative",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Comment added successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not comment to a non-existing BlogModel", async () => {
    const res = await request
      .post(`/api/comment/add/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: " Thanks this is very informative",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("BlogModel not found");
  });
});

describe("DELETE /api/Blog/delete/:blogID", () => {
  test("should delete to a BlogModel", async () => {
    const res = await request
      .delete(`/api/Blog/delete/${blogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("BlogModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing BlogModel", async () => {
    const res = await request
      .delete(`/api/Blog/delete/${blogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("BlogModel not found");
  });
});
