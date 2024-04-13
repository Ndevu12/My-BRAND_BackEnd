
import supertest from "supertest";
import { app } from "../app";
import InternshipModel from "../models/Internship.ts";

export const request = supertest(app);

const user = {
    fullname: "Test User",
    username: "test",
    email: "ndevulion@gmail.com",
    password: "@K1234passkey",
    phoneNumber: "0785044398",
    role: "admin",
};

let internship1= '12';
let internship2= '21';
let internship3= '32';
let internship4= '43';
let internship5= '54';

let certificate = [internship1, internship2, internship3, internship4, internship5];


let token: string;
let userId: string;
let internshipID: string;

beforeAll(async () => {
  await InternshipModel.deletemany();
});

// Test signup feature/functionality
describe("POST /api/internship", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new InternshipModel post", async () => {
        const res = await request
            .post("/api/internship/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("InternshipModel created");
        expect(res.body.data).toBeDefined();
        internshipID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/internship/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("InternshipModel already exists");
    });
});

describe("GET /api/internship/:internshipID", () => {
    test("should retrieve a single internship ", async () => {
        const newInternshipModeldata = {
            title: 'Software Engineering',
            content: 'Software Engineering',
            company: 'Andela',
            duration: '6 months',
            compilationDate: new Date('2022-09-01'),
            certificate: certificate,
        };
        await InternshipModel.createInternship(newInternshipModeldata);
        const res = await request.get(`/api/internship/${internshipID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("InternshipModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return InternshipModel not found ,InternshipModel id doesn't exist", async () => {
        const res = await request.get(`/api/internship/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("InternshipModel not found");
    });
});

describe("GET /api/internship/all", () => {
  test("should retrieve all blog Categorys", async () => {
    const res = await request.get("/api/internship/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All InternshipModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/internship/update/:internshipID", () => {
  test("should update the InternshipModel", async () => {
    const res = await request
      .patch(`/api/internship/update/${internshipID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'I would likt to have too much of it',
        school: 'ALX',
        startDate: new Date('2021-09-01'), 
        compilationDate: new Date('2022-09-01'),
        certificate: certificate,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("InternshipModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing InternshipModel", async () => {
    const res = await request
      .patch(`/api/internship/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: internship4,
        internshiperName:  'Ndevu',
        internship: 'Wow I like this post, I would likt to have too much of it.',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("blog Category not found");
  });
});

describe("DELETE /api/internship/delete/:internshipID", () => {
  test("should delete to a InternshipModel", async () => {
    const res = await request
      .delete(`/api/internship/delete/${internshipID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("InternshipModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing InternshipModel", async () => {
    const res = await request
      .delete(`/api/internship/delete/${internshipID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("InternshipModel not found");
  });
});
