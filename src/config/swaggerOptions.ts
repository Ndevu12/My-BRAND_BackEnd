import swaggerjsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
import { SwaggerServer } from "../start-ups/SwaggerServer";

dotenv.config();

const swaggerServer = SwaggerServer();

const options: swaggerjsdoc.Options = {
  definition: {
    openapi: "3.0.2",
    info: {
      title: "Ndevu's Portfolio Website API Documentation",
      version: "1.0.0",
      description:
        "MyBrand Website's Backend API documentation of how to use the API to perform various operations.",
      contact: {
        name: "NdevuSpace",
        url: "https://ndevuspace.netlify.app/",
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
  apis: ["./src/docs/*.yml"],
};

const swaggerDocs = swaggerjsdoc(options);

export default swaggerDocs;
