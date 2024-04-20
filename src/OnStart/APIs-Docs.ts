import { app } from "../app.ts";
import swaggerDocs from "../API_config/swaggerOptions.ts";
import swaggerUi from "swagger-ui-express";

export const Documentation = (): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
