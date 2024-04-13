
import supertest from "supertest";
import { app } from "../app";
import  {notificationModel } from "../models/notification.ts";

const NotificationModel = new notificationModel();

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
let LicenseID: string;

beforeAll(async () => {
  await  NotificationModel.deletemany();
});

// Test signup feature/functionality
describe("POST /api/notification", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new  notificationModel post", async () => {
        const res = await request
            .post("/api/notification/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Software Engineering rty8u9i09o--pghjnk',
                description: 'Software Engineering',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(" notificationModel created");
        expect(res.body.data).toBeDefined();
        LicenseID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/notification/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Software Engineering rty8u9i09o--pghjnk',
                description: 'Software Engineering',
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe(" notificationModel already exists");
    });
});

describe("GET /api/notification/:LicenseID", () => {
    test("should retrieve a single notification ", async () => {
        const notificationModeldata = {
            title: 'Software Engineering rty8u9i09o--pghjnk and web Dev',
            description: 'Software Engineering and soft',
        };
        await  NotificationModel.createNotification(notificationModeldata);
        const res = await request.get(`/api/notification/${LicenseID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(" notificationModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return  notificationModel not found , notificationModel id doesn't exist", async () => {
        const res = await request.get(`/api/notification/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(" notificationModel not found");
    });
});

describe("GET /api/notification/all", () => {
  test("should retrieve all license Categorys", async () => {
    const res = await request.get("/api/notification/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All  notificationModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/notification/update/:LicenseID", () => {
  test("should update the  notificationModel", async () => {
    const res = await request
      .patch(`/api/notification/update/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'Software Engineering rty8u9i09o--pghjnk and web Dev',
        description: 'Software Engineering and soft....',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" notificationModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing  notificationModel", async () => {
    const res = await request
      .patch(`/api/notification/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: '65f3134a494934b10177c062',
        title: 'Software Engineering rty8u9i09o--pghjnk and web Dev',
        description: 'Software Engineering and soft....',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("license Category not found");
  });
});

describe("DELETE /api/notification/delete/:LicenseID", () => {
  test("should delete to a  notificationModel", async () => {
    const res = await request
      .delete(`/api/notification/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" notificationModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing  notificationModel", async () => {
    const res = await request
      .delete(`/api/notification/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(" notificationModel not found");
  });
});
