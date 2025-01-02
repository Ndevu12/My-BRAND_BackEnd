import { app } from "../app";
import swaggerDocs from "../API_config/swaggerOptions";
import swaggerUi from "swagger-ui-express";

export const Documentation = (): void => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
