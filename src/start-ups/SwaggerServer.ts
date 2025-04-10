import dotenv from "dotenv";

dotenv.config();

function SwaggerServer(): string {
  if (process.env.SWAGGER_SERVER !== undefined) {
    return process.env.SWAGGER_SERVER;
  }

  return "http://localhost:6090/api";
}

export { SwaggerServer };
