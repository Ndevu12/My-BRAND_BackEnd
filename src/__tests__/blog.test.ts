import supertest from "supertest";
import { app } from "../app";
import BlogServices from "../services/blogService.ts";
import mongoose from "mongoose";


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
let BlogID: string;

beforeAll(async () => {
  await BlogServices.deleteAllBlogs();
},  100000);


// Test signup feature/functionality
describe("POST /api/Blog", () => {
  test("create an author", async () => {
    const res = await request.post("/api/author/create").send(user);
    expect(res.statusCode).toBe(201); 
    expect(res.body.message).toBe("Author created successful");
    userId = res.body.data._id;
    token = res.body.data.accessToken;
    expect(res.body.data).toBeDefined();
  });

  test("create a new Blog post", async () => {
    const res = await request
      .post("/api/Blog/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        author: userId,
        description: "This is a test Blog post",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Blog created");
    expect(res.body.data).toBeDefined();
    BlogID = res.body.data._id;
  });
  test("Don't create duplicate", async () => {
    const res = await request
      .post("/api/Blog/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        author: userId,
        description: "This is a test Blog post",
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Blog already exists");
  });
});

describe("GET /api/Blog/:BlogID", () => {
  test("should retrieve a single Blog post", async () => {
    const newBlogdata = {
      title: "Test Blog 2",
      description: "This is another test Blog post",
      author: userId,
      imageURL: '', 
    };
    await BlogServices.createBlog(newBlogdata);
    const res = await request.get(`/api/Blog/${BlogID}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog retrieved successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should return Blog not found ,Blog id doesn't exist", async () => {
    const res = await request.get(`/api/Blog/65f3134a494934b10177c062`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Blog not found");
  });
});

describe("GET /api/Blog/all", () => {
  test("should retrieve all Blogs", async () => {
    const res = await request.get("/api/Blog/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All Blogs retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/Blog/update/:BlogID", () => {
  test("should update the Blog", async () => {
    const res = await request
      .patch(`/api/Blog/update/${BlogID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Title",
        description: "Update the description",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing Blog", async () => {
    const res = await request
      .patch(`/api/Blog/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Title",
        description: "Update the description",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Blog not found");
  });
});

describe("PATCH /api/Blog/like/:BlogID", () => {
  test("should like a Blog", async () => {
    const res = await request
      .patch(`/api/Blog/like/${BlogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog liked successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not like Blog two times", async () => {
    const res = await request
      .patch(`/api/Blog/like/${BlogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("You have already liked this Blog");
  });
  test("should not like a non-existing Blog", async () => {
    const res = await request
      .patch(`/api/Blog/like/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Blog not found");
  });
});

describe("POST /api/comment/add/:BlogID", () => {
  test("should add comment to a Blog", async () => {
    const res = await request
      .post(`/api/comment/add/${BlogID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: " Thanks this is very informative",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Comment added successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not comment to a non-existing Blog", async () => {
    const res = await request
      .post(`/api/comment/add/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: " Thanks this is very informative",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Blog not found");
  });
});

describe("DELETE /api/Blog/delete/:BlogID", () => {
  test("should delete to a Blog", async () => {
    const res = await request
      .delete(`/api/Blog/delete/${BlogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing Blog", async () => {
    const res = await request
      .delete(`/api/Blog/delete/${BlogID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Blog not found");
  });
});
