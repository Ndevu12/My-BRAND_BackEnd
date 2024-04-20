import swaggerjsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { SwaggerServer } from "../OnStart/SwaggerServer.ts";

dotenv.config();

const swagerServer = SwaggerServer();

const options: swaggerjsdoc.Options = {
  definition: {
    openapi: "3.0.2",
    info: {
      title: "Portfolio Website API Documentation",
      version: "1.0.0",
      description:
        "MyBrand Website's Backend API documentation of how to use the API to perform various operations.",
      contact: {
        name: "MyBrand Website",
        url: "https://ndevu12.github.io/My-BRAND/",
        email: "ndevulion@mybrand.com",
      },
    },
    servers: [{ url: swagerServer }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/APIs_Documentation/*.ts", "./src/APIs_Documentation/*.yml"],
};

const swaggerDocs = swaggerjsdoc(options);

export default swaggerDocs;
