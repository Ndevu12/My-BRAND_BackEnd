
import supertest from "supertest";
import { app } from "../app";
import  NotificationService  from "../services/notificationService.ts";



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
  await  NotificationService.deletemany();
},  100000);

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

    test("create a new  NotificationService post", async () => {
        const res = await request
            .post("/api/notification/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Software Engineering rty8u9i09o--pghjnk',
                description: 'Software Engineering',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(" NotificationService created");
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
        expect(res.body.message).toBe(" NotificationService already exists");
    });
});

describe("GET /api/notification/:LicenseID", () => {
    test("should retrieve a single notification ", async () => {
        const NotificationServicedata = {
            title: 'Software Engineering rty8u9i09o--pghjnk and web Dev',
            description: 'Software Engineering and soft',
        };
        await  NotificationService.createNotification(NotificationServicedata);
        const res = await request.get(`/api/notification/${LicenseID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(" NotificationService retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return  NotificationService not found , NotificationService id doesn't exist", async () => {
        const res = await request.get(`/api/notification/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(" NotificationService not found");
    });
});

describe("GET /api/notification/all", () => {
  test("should retrieve all license Categorys", async () => {
    const res = await request.get("/api/notification/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All  NotificationServices retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/notification/update/:LicenseID", () => {
  test("should update the  NotificationService", async () => {
    const res = await request
      .patch(`/api/notification/update/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'Software Engineering rty8u9i09o--pghjnk and web Dev',
        description: 'Software Engineering and soft....',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" NotificationService updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing  NotificationService", async () => {
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
  test("should delete to a  NotificationService", async () => {
    const res = await request
      .delete(`/api/notification/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" NotificationService deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing  NotificationService", async () => {
    const res = await request
      .delete(`/api/notification/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(" NotificationService not found");
  });
});
