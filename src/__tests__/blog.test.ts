import supertest from "supertest";
import { app } from "../app";
import blogServices from "../services/blogService";
import mongoose from "mongoose";
// import reset from "../controllers/reset.ts";

export const request = supertest(app);

const user = {
  fullName: "Muraho",
  username: "Murakoma",
  email: "Hamagndevulion@gmail.com",
  password: "M1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

const author = {
  author: {
    name: "Hale",
    email: "haleywywirbch@gmail.com",
  },
};

const categoryData = {
  name: "Holaholaholation",
};

let token: string;

// Startin gpoint
describe("api/blog", () => {
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

  // Test signup feature/functionality
  describe("POST /api/blog/", () => {
    test("create category", async () => {
      const res = await request
        .post("/api/blogCategory/create")
        .send(categoryData);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("category created successful");
      expect(res.body.data).toBeDefined();
    });

    test("create a new blog post", async () => {
      const res = await request
        .post("/api/blog/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test blog",
          content: "This is a test blog post",
          Description: "This is a test blog post",
          author: author,
          category: ["662242e7166fcbb45d294c49"],
          tags: ["test", "test2"],
          likes: 0,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Blog created successfully");
      expect(res.body.data).toBeDefined();
    });
    test("Don't create duplicate", async () => {
      const res = await request
        .post("/api/blog/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "7yfg, hjukgih hgbuki kotyuiop",
          content:
            "This is my first blog post so, Button and add a name to your test, 123",
          description:
            "button and add afcgvhbjnkml;fgvbhjnm name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that",
          category: "661bc8ff537e31bb91cacc7d",
          author: {
            name: "Ndevu Ndevu",
            email: "jeanpaulelisa@gmail.com",
          },
          tags: ["Science", "Technology", "Social Life"],
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Blog already exists");
    });
  });

  describe("GET /api/blog/:id", () => {
    test("should retrieve a single blog post", async () => {
      const newblogdata: any = {
        title: "Mhn sfnj Test blog 2. Another sample",
        content: "sdcas This is a test blog post",
        Description: "This is a test blog post",
        author: author,
        category: ["662242e7166fcbb45d294c49"],
        tags: ["test", "test2"],
        likes: 0,
      };
      await blogServices.createBlog(newblogdata);
      const res = await request.get(`/api/blog/662266b57d063b567b5fdfb4`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("blog retrieved successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should return blog not found ,blog id doesn't exist", async () => {
      const res = await request.get(`/api/blog/6622a9afad45b4fae3e484b6`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("blog not found");
    });
  });

  describe("GET /api/blog/", () => {
    test("should retrieve all blogs", async () => {
      const res = await request.get("/api/blog/");
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("All blogs retrieved!");
      expect(res.body.data).toBeDefined();
    });
  });
  describe("PUT /api/blog/update/:id", () => {
    test("should update the blog", async () => {
      const res = await request
        .put(`/api/blog/update/662242dc2dd2bf959e169d3c`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Update Title",
          description: "Update the description",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("blog updated successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not update a non-existing blog", async () => {
      const res = await request
        .put(`/api/blog/update/6622a9afad45b4fae3e484b6`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Update Title",
          description: "Update the description",
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("blog not found");
    });
  });

  describe("Post /api/blog/like/:id", () => {
    test("should like a blog", async () => {
      const res = await request
        .put(`/api/blog/like/6622a6e0589b5089d425fc52`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("blog liked successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not like a non-existing blog", async () => {
      const res = await request
        .put(`/api/blog/like/6622a9afad45b4fae3e484b6`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("blog not found");
    });
  });

  describe("POST /api/comment/add", () => {
    test("should add comment to a blog", async () => {
      const res = await request
        .post(`/api/comment/add/6622a6e0589b5089d425fc52`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          commenterName: "tester",
          comment: " Thanks this is very informative",
          postID: ["6622a6e0589b5089d425fc52"],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Comment added successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not comment to a non-existing blog", async () => {
      const res = await request
        .post(`/api/comment/6622a9afad45b4fae3e484b6`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          commenterName: "tester",
          comment: " Thanks this is very informative",
          postID: ["6622a6e0589b5089d425fc52"],
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("blog not found");
    });
  });

  describe("DELETE /api/blog/delete/:id", () => {
    test("should delete a blog", async () => {
      const res = await request
        .delete(`/api/blog/delete/66226ebcfa94f1be8f949c43`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("blog deleted successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not delete a non-existing blog", async () => {
      const res = await request
        .delete(`/api/blog/delete/6622a9afad45b4fae3e484b6`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("blog not found");
    });
  });
});
