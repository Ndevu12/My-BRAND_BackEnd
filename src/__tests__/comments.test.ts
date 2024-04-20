import supertest from "supertest";
import { app } from "../app";
import CommentController from "../controllers/CommentController";
import mongoose from "mongoose";
// import reset from "../controllers/reset";

export const request = supertest(app);

const user = {
  fullName: "kim Test User",
  username: "Kimtest",
  email: "kimndevulion@gmail.com",
  password: "kimK1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

const author = {
  author: {
    name: "Hale",
    email: "haleywywirbch@gmail.com",
  },
};

let categoryID: string;
let token: string;
let userId: string;
let CommentID: string;
let blogID: string;

const categoryData = {
  name: "hnmTechnology",
};

// Startin gpoint
describe("api/comment", () => {
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
    await mongoose.connection.close();
  });

  // Test signup feature/functionality
  describe("POST /api/comment", () => {
    test("Should create a category", async () => {
      const res = await request
        .post("/api/blogCategory/create")
        .send(categoryData);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("category created successful");
      expect(res.body.data).toBeDefined();
    });

    test("Should create a new blog", async () => {
      const res = await request
        .post("/api/blog/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test blog ufkiuvhvjkjgh",
          content: "This is a test blog post",
          Description: "This is a test blog post",
          author: author,
          category: ["6622c318d2ec9e81782bf6e3"],
          tags: ["test"],
          likes: 0,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Blog created successfully");
      expect(res.body.data).toBeDefined();
      blogID = res.body.data._id;
    });

    test("Should create a new comment", async () => {
      const res = await request
        .post("/api/comment/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
          postID: ["622642b7d063b567b5fdfae"],
          commenterName: "Ndevu re",
          comment: "Wow I like this post, I would likt to have too much of it",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Comment created");
      expect(res.body.data).toBeDefined();
      CommentID = res.body.data._id;
    });
  });

  describe("DELETE /api/comment/delete/:CommentID", () => {
    test("should delete a Comment", async () => {
      const res = await request
        .delete(`/api/comment/delete/6622c737d2ec9e81782bf6fe`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Comment deleted successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not delete a non-existing Comment", async () => {
      const res = await request
        .delete(`/api/comment/delete/6622642b7d063b567b5fdfae`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("comment with the given ID was not found");
    });
  });
});
