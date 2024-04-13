
import supertest from "supertest";
import { app } from "../app";
import  LicenseModel from "../models/lisenceAndCertificate.ts";

export const request = supertest(app);

const user = {
    fullname: "Test User",
    username: "test",
    email: "ndevulion@gmail.com",
    password: "@K1234passkey",
    phoneNumber: "0785044398",
    role: "admin",
};

let licenseandcertificate1= '12';
let licenseandcertificate2= '21';
let licenseandcertificate3= '32';
let licenseandcertificate4= '43';
let licenseandcertificate5= '54';

let certificate = [licenseandcertificate1, licenseandcertificate2, licenseandcertificate3, licenseandcertificate4, licenseandcertificate5];


let token: string;
let userId: string;
let LicenseID: string;

beforeAll(async () => {
  await  LicenseModel.deletemany();
});

// Test signup feature/functionality
describe("POST /api/licenseandcertificate", () => {
    test("create an author", async () => {
        const res = await request.post("/api/user/signup").send(user);
        expect(res.statusCode).toBe(201); 
        expect(res.body.message).toBe("Signup successful");
        userId = res.body.data._id;
        token = res.body.data.accessToken;
        expect(res.body.data).toBeDefined();
    });

    test("create a new  LicenseModel post", async () => {
        const res = await request
            .post("/api/licenseandcertificate/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Course: 'Software Engineering',
                content: 'Software Engineering',
                school: 'Andela',
                duration:'6 months',
                compilationDate: new Date('2022-09-01'),
                certificate: certificate,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(" LicenseModel created");
        expect(res.body.data).toBeDefined();
        LicenseID = res.body.data._id;
    });
    test("Don't create duplicate", async () => {
        const res = await request
            .post("/api/licenseandcertificate/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'I would likt to have too much of it',
                school: 'ALX',
                startDate: '2021-09-01',
                compilationDate: '2022-09-01',
                certificate: certificate,
            });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe(" LicenseModel already exists");
    });
});

describe("GET /api/licenseandcertificate/:LicenseID", () => {
    test("should retrieve a single licenseandcertificate ", async () => {
        const LicenseModeldata = {
            Course: 'Software Engineering And DevOps',
            content: 'Software Engineering',
            school: 'Andela',
            duration:'9 months',
            compilationDate: new Date('2022-09-04'),
            certificate: certificate,
        };
        await  LicenseModel.createLicenseAndCertificate(LicenseModeldata);
        const res = await request.get(`/api/licenseandcertificate/${LicenseID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(" LicenseModel retrieved successfully");
        expect(res.body.data).toBeDefined();
    });
    test("should return  LicenseModel not found , LicenseModel id doesn't exist", async () => {
        const res = await request.get(`/api/licenseandcertificate/65f3134a494934b10177c062`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(" LicenseModel not found");
    });
});

describe("GET /api/licenseandcertificate/all", () => {
  test("should retrieve all license Categorys", async () => {
    const res = await request.get("/api/licenseandcertificate/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All  LicenseModels retrieved!");
    expect(res.body.data).toBeDefined();
  });
});
describe("PATCH /api/licenseandcertificate/update/:LicenseID", () => {
  test("should update the  LicenseModel", async () => {
    const res = await request
      .patch(`/api/licenseandcertificate/update/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 'I would likt to have too much of it',
        school: 'ALX',
        startDate: new Date('2021-09-01'), 
        compilationDate: new Date('2022-09-01'),
        certificate: certificate,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" LicenseModel updated successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not update a non-existing  LicenseModel", async () => {
    const res = await request
      .patch(`/api/licenseandcertificate/update/65f3134a494934b10177c062`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_ID: licenseandcertificate4,
        licenseandcertificateerName:  'Ndevu',
        licenseandcertificate: 'Wow I like this post, I would likt to have too much of it.',
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("license Category not found");
  });
});

describe("DELETE /api/licenseandcertificate/delete/:LicenseID", () => {
  test("should delete to a  LicenseModel", async () => {
    const res = await request
      .delete(`/api/licenseandcertificate/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(" LicenseModel deleted successfully");
    expect(res.body.data).toBeDefined();
  });
  test("should not delete a non-existing  LicenseModel", async () => {
    const res = await request
      .delete(`/api/licenseandcertificate/delete/${LicenseID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(" LicenseModel not found");
  });
});
