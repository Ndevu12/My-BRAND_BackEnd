import { app } from "../app";
import swaggerDocs from "../config/swaggerOptions";
import swaggerUi from "swagger-ui-express";

export const Documentation = (): void => {
  app.use("/docs", swaggerUi.serve as any, swaggerUi.setup(swaggerDocs));
};
