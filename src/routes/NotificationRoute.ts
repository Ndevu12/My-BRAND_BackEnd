// const necessary modules
import { Router } from "express";
import NotificationController from "../controllers/notificationController";
import { isAdmin } from "../middlewares/authUtils";

const notificationRoutes: Router = Router();

// Define routes
notificationRoutes.post("/create", NotificationController.createNotification);
notificationRoutes.put(
  "/update/:id",
  NotificationController.updateNotification
);
notificationRoutes.get("/:id", NotificationController.getNotificationById);
notificationRoutes.get("/", NotificationController.getAllNotifications);
notificationRoutes.delete(
  "/delete/:id",
  isAdmin,
  NotificationController.deleteNotification
);

// Export the router
export default notificationRoutes;
