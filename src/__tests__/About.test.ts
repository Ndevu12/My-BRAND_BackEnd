import supertest from "supertest";
import { app} from "../app.ts";
import {AboutModel} from "../models/About.ts";

export const request = supertest(app);

const aboutModel = new AboutModel();

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
let aboutID: string;


const loginabout = {
  email: "elisandevu@gmail.com",
  password: "@K1234passkey",
};

beforeAll(async () => {
  await aboutModel.deleteAllabouts();
});
// Test signup feature/functionality
describe("POST /api/about", () => {
    test("create an author", async () => {
      const res = await request.post("/api/user/signup").send(user);

      expect(res.statusCode).toBe(201); 
      expect(res.body.message).toBe("Signup successful");
      userId = res.body.data._id;
      token = res.body.data.accessToken;
      expect(res.body.data).toBeDefined();
    });
  
    test("create About", async () => {
      const res = await request
        .post("/api/about/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            head: 'test',
            intro: 'Testing',
            mission: 'Mission Test',
            educationIds: [],
            experienceIds: [],
            internship: [],
            licenseAndCertificate: [],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("AboutModel created");
      expect(res.body.data).toBeDefined();
      aboutID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
      const res = await request
        .post("/api/about/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            head: 'test',
            intro: 'Testing',
            mission: 'Mission Test',
            educationIds: [],
            experienceIds: [],
            internship: [],
            licenseAndCertificate: [],
        });
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("AboutModel already exists");
    });
  });
  
  describe("GET /api/about/:aboutID", () => {
    test("should retrieve a single AboutModel post", async () => {
      const newaboutdata = {
        head: 'test 2',
        intro: 'Testing description',
        mission: 'Mission is Test/I dont know know it',
        educationIds: [],
        experienceIds: [],
        internship: [],
        licenseAndCertificate: [],
      };
      await aboutModel.createAbout(newaboutdata);
      const res = await request.get(`/api/about/${aboutID}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("AboutModel retrieved successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should return AboutModel not found ,about id doesn't exist", async () => {
      const res = await request.get(`/api/about/65f3134a494934b10177c062`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("about not found");
    });
  });
  
  describe("GET /api/about/all", () => {
    test("should retrieve all AboutModels", async () => {
      const res = await request.get("/api/about/all");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("All AboutModels retrieved!");
      expect(res.body.data).toBeDefined();
    });
  });
  describe("PATCH /api/about/update/:aboutID", () => {
    test("should update the AboutModel", async () => {
      const res = await request
        .patch(`/api/about/update/${aboutID}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Update Title",
          description: "Update the description",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("AboutModel updated successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not update a non-existing AboutModel", async () => {
      const res = await request
        .patch(`/api/about/update/65f3134a494934b10177c062`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Update Title",
          description: "Update the description",
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("AboutModel not found");
    });
  });
  
  describe("DELETE /api/about/delete/:aboutID", () => {
    test("should delete to a AboutModel", async () => {
      const res = await request
        .delete(`/api/about/delete/${aboutID}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("AboutModel deleted successfully");
      expect(res.body.data).toBeDefined();
    });
    test("should not delete a non-existing AboutModel", async () => {
      const res = await request
        .delete(`/api/about/delete/${aboutID}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("AboutModel not found");
    });
  });
  