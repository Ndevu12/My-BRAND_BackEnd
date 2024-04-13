import supertest from "supertest";
import { app } from "../app";
import  { Analytics } from "../models/Analytics.ts";

const analytics = new Analytics();

export const request = supertest(app);

const user = {
  fullname: "Test User",
  username: "test",
  email: "ndevulion@gmail.com",
  password: "@K1234passkey",
  phoneNumber: "0785044398",
  role: "admin",
};

let BlogID1= '12';
let BlogID2= '21';
let BlogID3= '32';
let BlogID4= '43';
let BlogID5= '54';

let MostShared = [BlogID1, BlogID2, BlogID3, BlogID4, BlogID5];
let MostLiked = [BlogID1, BlogID2, BlogID3, BlogID4];
let MostViewed = [BlogID1, BlogID2, BlogID3];

let token: string;
let userId: string;
let AnalyticsID: string;

beforeAll(async () => {
  await analytics.deletemany();
});

// Test signup feature/functionality
describe("POST /api/Analytics", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new Analytics post", async () => {
        const res = await request
            .post("/api/Analytics/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Analytics",
                author: userId,
                description: "This is a test Analytics post",
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Analytics created");
        expect(res.body.data).toBeDefined();
        AnalyticsID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/Analytics/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                mostViewedBlog: MostViewed,
                mostLikedBlog: MostLiked,
                mostSharedBlog: MostShared,
                visitors: 120,
                subscribers: 30,
                spaceStatus: 'active',
                dateRange: '7 days',
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("Analytics already exists");
    });
});

describe("GET /api/Analytics/:AnalyticsID", () => {
    test("should retrieve a single Analytics post", async () => {
        const newAnalyticsdata = {
            mostViewedBlog: MostViewed,
            mostLikedBlog: MostLiked,
            mostSharedBlog: MostShared,
            visitors: 120,
            subscribers: 30,
            spaceStatus: 'active',
            dateRange: '7 days',
        };
        await analytics.createAnalytics(newAnalyticsdata);
        const res = await request.get(`/api/Analytics/${AnalyticsID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Analytics retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return Analytics not found ,Analytics id doesn't exist", async () => {
        const res = await request.get(`/api/Analytics/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Analytics not found");
    });
});

describe("GET /api/Analytics/all", () => {
  test("should retrieve all Analyticss", async () => {
    const res = await request.get("/api/Analytics/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All Analyticss retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/Analytics/update/:AnalyticsID", () => {
  test("should update the Analytics", async () => {
    const res = await request
      .patch(`/api/Analytics/update/${AnalyticsID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        mostViewedBlog: MostViewed,
        mostLikedBlog: MostLiked,
        mostSharedBlog: MostShared,
        visitors: 10,
        subscribers: 0,
        spaceStatus: 'Inactive',
        dateRange: '14 days',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Analytics updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing Analytics", async () => {
    const res = await request
      .patch(`/api/Analytics/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Title",
        description: "Update the description",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Analytics not found");
  });
});

describe("DELETE /api/Analytics/delete/:AnalyticsID", () => {
  test("should delete to a Analytics", async () => {
    const res = await request
      .delete(`/api/Analytics/delete/${AnalyticsID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Analytics deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing Analytics", async () => {
    const res = await request
      .delete(`/api/Analytics/delete/${AnalyticsID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Analytics not found");
  });
});
