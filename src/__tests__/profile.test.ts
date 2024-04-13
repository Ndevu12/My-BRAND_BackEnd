
import supertest from "supertest";
import { app } from "../app";
import  ProfileModel from "../models/profile.ts";

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
  await  ProfileModel.deletemany();
});

// Test signup feature/functionality
describe("POST /api/profile", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new  ProfileModel post", async () => {
        const res = await request
            .post("/api/profile/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                profileImage: undefined,
                name: 'Ndevu',
                location: 'Kigali-Rwanda',
                contactInfo: 'Contact me at anytime',
                password: 'Kwahira',
                displayName: 'Ndevu12',
                email: 'ndevulionelisa@gmail.com',
                phone: '0785044398',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(" ProfileModel created");
        expect(res.body.data).toBeDefined();
        LicenseID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/profile/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                profileImage: undefined,
                name: 'Ndevu',
                location: 'Kigali-Rwanda',
                contactInfo: 'Contact me at anytime',
                password: 'Kwahira',
                displayName: 'Ndevu12',
                email: 'ndevulionelisa@gmail.com',
                phone: '0785044398',
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe(" ProfileModel already exists");
    });
});

describe("GET /api/profile/:LicenseID", () => {
    test("should retrieve a single profile ", async () => {
        const ProfileModeldata = {
            name: 'Ndevu1',
            location: 'Gikondo-Kigali-Rwanda',
            contactInfo: 'Contact me at anytime',
            password: 'Kwahirwa',
            displayName: 'Ndevu12',
            email: 'ndevulionelisa@gmail.com',
            phone: '0785044398',
        };
        await  ProfileModel.createProfile(ProfileModeldata);
        const res = await request.get(`/api/profile/${LicenseID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(" ProfileModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return  ProfileModel not found , ProfileModel id doesn't exist", async () => {
        const res = await request.get(`/api/profile/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(" ProfileModel not found");
    });
});

describe("GET /api/profile/all", () => {
  test("should retrieve all license Categorys", async () => {
    const res = await request.get("/api/profile/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All  ProfileModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/profile/update/:LicenseID", () => {
  test("should update the  ProfileModel", async () => {
    const res = await request
      .patch(`/api/profile/update/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: 'Ndevu1',
        location: 'Gikondo-Kigali-Rwanda',
        contactInfo: 'Contact me at anytime',
        password: 'Kwahirwa',
        displayName: 'Ndevu12',
        email: 'ndevulionelisa@gmail.com',
        phone: '0785044398',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" ProfileModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing  ProfileModel", async () => {
    const res = await request
      .patch(`/api/profile/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: '65f3134a494934b10177c062',
        name: 'Ndevu1',
        location: 'Gikondo-Kigali-Rwanda',
        contactInfo: 'Contact me at anytime',
        password: 'Kwahirwa',
        displayName: 'Ndevu12',
        email: 'ndevulionelisa@gmail.com',
        phone: '0785044398',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("license Category not found");
  });
});

describe("DELETE /api/profile/delete/:LicenseID", () => {
  test("should delete to a  ProfileModel", async () => {
    const res = await request
      .delete(`/api/profile/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" ProfileModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing  ProfileModel", async () => {
    const res = await request
      .delete(`/api/profile/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(" ProfileModel not found");
  });
});
