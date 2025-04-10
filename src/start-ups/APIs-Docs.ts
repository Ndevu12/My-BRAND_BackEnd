import { app } from "../app";
import swaggerDocs from "../API_config/swaggerOptions";
import swaggerUi from "swagger-ui-express";

export const Documentation = (): void => {
  app.use("/api-docs", swaggerUi.serve as any, swaggerUi.setup(swaggerDocs));
};
