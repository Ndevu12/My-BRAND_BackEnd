import supertest from "supertest";
import { app } from "../app";
import {experienceModel} from "../models/experience.ts";

const ExperienceModel = new experienceModel();

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
let certificate = ['certificate1', 'certificate2', 'certificate3'];


let token: string;
let userId: string;
let ExperienceID: string;

beforeAll(async () => {
  await ExperienceModel.deletemany();
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

    test("create a new ExperienceModel post", async () => {
        const res = await request
            .post("/api/experience/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("ExperienceModel created");
        expect(res.body.data).toBeDefined();
        ExperienceID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/experience/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("ExperienceModel already exists");
    });
});

describe("GET /api/experience/:ExperienceID", () => {
    test("should retrieve a single Comment ", async () => {
        const newExperienceModeldata = {
            title: 'I would likt to have too much of it and no.',
            school: 'ALX school',
            startDate: new Date('2021-09-01'), 
            compilationDate: new Date('2022-09-01'),
            certificate: certificate,
        };
        await ExperienceModel.createExperience(newExperienceModeldata);
        const res = await request.get(`/api/experience/${ExperienceID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("ExperienceModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return ExperienceModel not found ,ExperienceModel id doesn't exist", async () => {
        const res = await request.get(`/api/experience/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("ExperienceModel not found");
    });
});

describe("GET /api/experience/all", () => {
  test("should retrieve all blog Categorys", async () => {
    const res = await request.get("/api/experience/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All ExperienceModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/experience/update/:ExperienceID", () => {
  test("should update the ExperienceModel", async () => {
    const res = await request
      .patch(`/api/experience/update/${ExperienceID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'I would likt to have too much of it',
        school: 'ALX',
        startDate: new Date('2021-09-01'), 
        compilationDate: new Date('2022-09-01'),
        certificate: certificate,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("ExperienceModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing ExperienceModel", async () => {
    const res = await request
      .patch(`/api/experience/update/65f3134a494934b10177c062`)
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

describe("DELETE /api/experience/delete/:ExperienceID", () => {
  test("should delete to a ExperienceModel", async () => {
    const res = await request
      .delete(`/api/experience/delete/${ExperienceID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("ExperienceModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing ExperienceModel", async () => {
    const res = await request
      .delete(`/api/experience/delete/${ExperienceID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("ExperienceModel not found");
  });
});
