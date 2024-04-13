
import supertest from "supertest";
import { app } from "../app";
import  ServiceModel from "../models/Service.ts";

export const request = supertest(app);

const user = {
    fullname: "Test User",
    username: "test",
    email: "ndevulion@gmail.com",
    password: "@K1234passkey",
    phoneNumber: "0785044398",
    role: "admin",
};

let project1 = 432;
let project2 = 87;

let token: string;
let userId: string;
let LicenseID: string;

beforeAll(async () => {
  await  ServiceModel.deletemany();
});

// Test signup feature/functionality
describe("POST /api/service", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new  ServiceModel post", async () => {
        const res = await request
            .post("/api/service/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Contact me at anytime',
                intro: 'Contact me at anytime, zxrctfyguhijokdcfgvbhjnmkrftgyu ftgyuhjio tfgy',
                moreContent: 'uihjiokpl;gvhbjnkm yghujio yu9i9o tyu8i9 fghjk',
                projectSample: [project1, project2],
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(" ServiceModel created");
        expect(res.body.data).toBeDefined();
        LicenseID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/service/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Contact me at anytime',
                intro: 'Contact me at anytime, zxrctfyguhijokdcfgvbhjnmkrftgyu ftgyuhjio tfgy',
                moreContent: 'uihjiokpl;gvhbjnkm yghujio yu9i9o tyu8i9 fghjk',
                projectSample: [project1, project2],
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe(" ServiceModel already exists");
    });
});

describe("GET /api/service/:LicenseID", () => {
    test("should retrieve a single service ", async () => {
        const ServiceModeldata = {
            title: 'Contact me at anytime',
            intro: 'Contact me at anytime, zxrctfyguhijokdcfgvbhjnmkrftgyu ftgyuhjio tfgy',
            moreContent: 'uihjiokpl;gvhbjnkm yghujio yu9i9o tyu8i9 fghjk',
            projectSample: [project1.toString(), project2.toString(), '12ewqe'],
        };
        await  ServiceModel.createService(ServiceModeldata);
        const res = await request.get(`/api/service/${LicenseID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(" ServiceModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return  ServiceModel not found , ServiceModel id doesn't exist", async () => {
        const res = await request.get(`/api/service/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(" ServiceModel not found");
    });
});

describe("GET /api/service/all", () => {
  test("should retrieve all license Categorys", async () => {
    const res = await request.get("/api/service/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All  ServiceModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/service/update/:LicenseID", () => {
  test("should update the  ServiceModel", async () => {
    const res = await request
      .patch(`/api/service/update/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'Contact who',
        intro: 'Contact me at anytime, zxrctfyguhijokdcfgvbhjnmkrftgyu ftgyuhjio tfgy',
        moreContent: 'uihjiokpl;gvhbjnkm yghujio yu9i9o tyu8i9 fghjk',
        projectSample: [project1, project2],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" ServiceModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing  ServiceModel", async () => {
    const res = await request
      .patch(`/api/service/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: '65f3134a494934b10177c062',
        title: 'Con anytime',
        intro: 'Contact me at anytime, zxrctfyguhijokdcfgvbhjnmkrftgyu ftgyuhjio tfgy',
        moreContent: 'uihjiokpl;gvhbjnkm yghujio yu9i9o tyu8i9 fghjk',
        projectSample: [project1, project2],
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("license Category not found");
  });
});

describe("DELETE /api/service/delete/:LicenseID", () => {
  test("should delete to a  ServiceModel", async () => {
    const res = await request
      .delete(`/api/service/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" ServiceModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing  ServiceModel", async () => {
    const res = await request
      .delete(`/api/service/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(" ServiceModel not found");
  });
});
