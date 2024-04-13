import supertest from "supertest";
import { app } from "../app";
import EducationModel from "../models/education.ts";

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
let EducationModelID: string;

beforeAll(async () => {
  await EducationModel.deletemany();
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

    test("create a new EducationModel post", async () => {
        const res = await request
            .post("/api/education/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("EducationModel created");
        expect(res.body.data).toBeDefined();
        EducationModelID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/education/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("EducationModel already exists");
    });
});

describe("GET /api/education/:EducationModelID", () => {
    test("should retrieve a single Comment ", async () => {
        const newEducationModeldata = {
            title: 'I would likt to have too much of it and no.',
            school: 'ALX school',
            startDate: new Date('2021-09-01'), 
            compilationDate: new Date('2022-09-01'),
            certificate: certificate,
        };
        await EducationModel.createEducation(newEducationModeldata);
        const res = await request.get(`/api/education/${EducationModelID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("EducationModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return EducationModel not found ,EducationModel id doesn't exist", async () => {
        const res = await request.get(`/api/education/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("EducationModel not found");
    });
});

describe("GET /api/education/all", () => {
  test("should retrieve all blog Categorys", async () => {
    const res = await request.get("/api/education/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All EducationModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/education/update/:EducationModelID", () => {
  test("should update the EducationModel", async () => {
    const res = await request
      .patch(`/api/education/update/${EducationModelID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'I would likt to have too much of it',
        school: 'ALX',
        startDate: new Date('2021-09-01'), 
        compilationDate: new Date('2022-09-01'),
        certificate: certificate,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("EducationModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing EducationModel", async () => {
    const res = await request
      .patch(`/api/education/update/65f3134a494934b10177c062`)
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

describe("DELETE /api/education/delete/:EducationModelID", () => {
  test("should delete to a EducationModel", async () => {
    const res = await request
      .delete(`/api/education/delete/${EducationModelID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("EducationModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing EducationModel", async () => {
    const res = await request
      .delete(`/api/education/delete/${EducationModelID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("EducationModel not found");
  });
});
