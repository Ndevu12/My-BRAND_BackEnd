import supertest from "supertest";
import { app } from "../app";
import CommentModel from "../models/comments.ts";

export const request = supertest(app);

const user = {
  fullname: "Test User",
  username: "test",
  email: "ndevulion@gmail.com",
  password: "@K1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

let BlogID0 = '00';
let BlogID1= '12';
let BlogID4= '43';


let token: string;
let userId: string;
let CommentModelID: string;

beforeAll(async () => {
  await CommentModel.deletemany();
});

// Test signup feature/functionality
describe("POST /api/Comment", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new CommentModel post", async () => {
        const res = await request
            .post("/api/blog/Category/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                post_ID: BlogID0,
                commenterName:  'Ndevu',
                comment: 'Wow I like this post, I would likt to have too much of it',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("CommentModel created");
        expect(res.body.data).toBeDefined();
        CommentModelID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/blog/Category/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                post_ID: BlogID0,
                commenterName:  'Ndevu',
                comment: 'Wow I like this post, I would likt to have too much of it',
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("CommentModel already exists");
    });
});

describe("GET /api/blog/Category/:CommentModelID", () => {
    test("should retrieve a single Comment ", async () => {
        const newCommentModeldata = {
            post_ID: BlogID1,
            commenterName:  'Ndevu12',
            comment: 'Wow I like this post, I would likt to have too much of it. ooooooooh',
        };
        await CommentModel.createComment(newCommentModeldata);
        const res = await request.get(`/api/blog/Category/${CommentModelID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("CommentModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return CommentModel not found ,CommentModel id doesn't exist", async () => {
        const res = await request.get(`/api/blog/Category/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("CommentModel not found");
    });
});

describe("GET /api/blog/Category/all", () => {
  test("should retrieve all blog Categorys", async () => {
    const res = await request.get("/api/blog/Category/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All CommentModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/blog/Category/update/:CommentModelID", () => {
  test("should update the CommentModel", async () => {
    const res = await request
      .patch(`/api/blog/Category/update/${CommentModelID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: BlogID0,
        commenterName:  'Ndevu',
        comment: 'Wow I like this post, I would likt to have too much of it',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("CommentModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing CommentModel", async () => {
    const res = await request
      .patch(`/api/blog/Category/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: BlogID4,
        commenterName:  'Ndevu',
        comment: 'Wow I like this post, I would likt to have too much of it.',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("blog Category not found");
  });
});

describe("DELETE /api/blog/Category/delete/:CommentModelID", () => {
  test("should delete to a CommentModel", async () => {
    const res = await request
      .delete(`/api/blog/Category/delete/${CommentModelID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("CommentModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing CommentModel", async () => {
    const res = await request
      .delete(`/api/blog/Category/delete/${CommentModelID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("CommentModel not found");
  });
});
