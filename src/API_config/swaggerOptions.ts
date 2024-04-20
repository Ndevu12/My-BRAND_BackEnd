import swaggerjsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { SwaggerServer } from "../OnStart/SwaggerServer";

dotenv.config();

const swaggerServer = SwaggerServer();

const options: swaggerjsdoc.Options = {
  definition: {
    openapi: "3.0.2",
    info: {
      title: "Ndevu's portfolio Website API Documentation",
      version: "1.0.0",
      description:
        "MyBrand Website's Backend API documentation of how to use the API to perform various operations.",
      contact: {
        name: "NdevuSpace",
        url: "https://ndevu12.github.io/My-BRAND/",
        email: "niyokwizerwajeanpaulelisa@gmail.com",
      },
    },
    servers: [{ url: swaggerServer }],
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
