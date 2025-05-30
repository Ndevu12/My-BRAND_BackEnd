declare module "cookie-parser";
declare module "cors";
declare module "dotenv";
declare module "express" {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
declare module "supertest";
declare module "swagger-jsdoc";
declare module "swagger-ui-express";
declare module "jsonwebtoken";
declare module "crypto-js";
declare module "multer";
declare module "mongoose";
