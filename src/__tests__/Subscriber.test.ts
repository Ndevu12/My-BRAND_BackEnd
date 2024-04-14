
import supertest from "supertest";
import { app } from "../app";
import  SubscriberService from "../services/SubscriberService.ts";
import { Subscriber } from "../models/Subscriber.ts";


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

let MostLiked = [BlogID1, BlogID2, BlogID3, BlogID4];


let token: string;
let userId: string;
let LicenseID: string;

beforeAll(async () => {
  await  SubscriberService.deletemany();
}, 100000);


// Test signup feature/functionality
describe("POST /api/subscriber", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new  SubscriberService post", async () => {
        const res = await request
            .post("/api/subscriber/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                full_name: "Ndayenicaye Ndevu",
                email: 'jeanpaulelisan@gmail.com',
                location: 'Kigali-Rwanda',
                likedBlogs: MostLiked,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(" SubscriberService created");
        expect(res.body.data).toBeDefined();
        LicenseID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/subscriber/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                full_name: "Ndayenicaye Ndevu",
                email: 'jeanpaulelisan@gmail.com',
                location: 'Kigali-Rwanda',
                likedBlogs: MostLiked,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe(" SubscriberService already exists");
    });
});

describe("GET /api/subscriber/:LicenseID", () => {
    test("should retrieve a single subscriber ", async () => {
        const SubscriberServicedata = {
            full_name: "Ndayenicaye Ndevu_n1",
            email: 'jeanpaulelisan1@gmail.com',
            location: 'Kigali-Rwanda',
            likedBlogs: MostLiked,
        };
        await  Subscriber.insertMany(SubscriberServicedata);
        
        const res = await request.get(`/api/subscriber/${LicenseID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(" SubscriberService retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return  SubscriberService not found , SubscriberService id doesn't exist", async () => {
        const res = await request.get(`/api/subscriber/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(" SubscriberService not found");
    });
});

describe("GET /api/subscriber/all", () => {
  test("should retrieve all license Categorys", async () => {
    const res = await request.get("/api/subscriber/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All  SubscriberServices retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/subscriber/update/:LicenseID", () => {
  test("should update the  SubscriberService", async () => {
    const res = await request
      .patch(`/api/subscriber/update/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        full_name: "Ndayenicaye Ndaq",
        email: 'jeanpaulelisan2@gmail.com',
        location: 'Kigali-Rwanda',
        likedBlogs: MostLiked,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" SubscriberService updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing  SubscriberService", async () => {
    const res = await request
      .patch(`/api/subscriber/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: '65f3134a494934b10177c062',
        full_name: "Ndayenicaye N",
        email: 'jeanpaulelisan87@gmail.com',
        location: 'Kigali-Rwanda',
        likedBlogs: MostLiked,
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("license Category not found");
  });
});

describe("DELETE /api/subscriber/delete/:LicenseID", () => {
  test("should delete to a  SubscriberService", async () => {
    const res = await request
      .delete(`/api/subscriber/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" SubscriberService deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing  SubscriberService", async () => {
    const res = await request
      .delete(`/api/subscriber/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(" SubscriberService not found");
  });
});
