import supertest from "supertest";
import { app } from "../app";
import  CommentServices from "../services/commentService.ts";
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

let BlogID0 = '00';
let BlogID1= '12';
let BlogID4= '43';


let token: string;
let userId: string;
let CommentServicesID: string;

beforeAll(async () => {
  await CommentServices.deletemany();
},  100000);

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

    test("create a new CommentServices post", async () => {
        const res = await request
            .post("/api/blog/Category/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                post_ID: BlogID0,
                CommentServiceserName:  'Ndevu',
                CommentServices: 'Wow I like this post, I would likt to have too much of it',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("CommentServices created");
        expect(res.body.data).toBeDefined();
        CommentServicesID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/blog/Category/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                post_ID: BlogID0,
                CommentServiceserName:  'Ndevu',
                CommentServices: 'Wow I like this post, I would likt to have too much of it',
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("CommentServices already exists");
    });
});

describe("GET /api/blog/Category/:CommentServicesID", () => {
    test("should retrieve a single CommentServices ", async () => {
        const newCommentServicesdata = {
            post_ID: BlogID1,
            CommentServiceserName:  'Ndevu12',
            CommentServices: 'Wow I like this post, I would likt to have too much of it. ooooooooh',
        };
        await CommentServices.createComment(newCommentServicesdata);
        const res = await request.get(`/api/blog/Category/${CommentServicesID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("CommentServices retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return CommentServices not found ,CommentServices id doesn't exist", async () => {
        const res = await request.get(`/api/blog/Category/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("CommentServices not found");
    });
});

describe("GET /api/blog/Category/all", () => {
  test("should retrieve all blog Categorys", async () => {
    const res = await request.get("/api/blog/Category/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All CommentServicess retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/blog/Category/update/:CommentServicesID", () => {
  test("should update the CommentServices", async () => {
    const res = await request
      .patch(`/api/blog/Category/update/${CommentServicesID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: BlogID0,
        CommentServiceserName:  'Ndevu',
        CommentServices: 'Wow I like this post, I would likt to have too much of it',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("CommentServices updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing CommentServices", async () => {
    const res = await request
      .patch(`/api/blog/Category/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: BlogID4,
        CommentServiceserName:  'Ndevu',
        CommentServices: 'Wow I like this post, I would likt to have too much of it.',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("blog Category not found");
  });
});

describe("DELETE /api/blog/Category/delete/:CommentServicesID", () => {
  test("should delete to a CommentServices", async () => {
    const res = await request
      .delete(`/api/blog/Category/delete/${CommentServicesID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("CommentServices deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing CommentServices", async () => {
    const res = await request
      .delete(`/api/blog/Category/delete/${CommentServicesID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("CommentServices not found");
  });
});
