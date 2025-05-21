// const necessary modules
import { Router } from "express";
import SubscriberController from "../controllers/subscriberController";
import { isAdmin, isAdminOrSubscriber } from "../middlewares/authUtils";

const subscriberRoutes: Router = Router();

subscriberRoutes.post("/create", SubscriberController.createSubscriber);
subscriberRoutes.put(
  "/update/:id",
  isAdminOrSubscriber,
  SubscriberController.updateSubscriber
);
subscriberRoutes.get("/:id", isAdmin, SubscriberController.getSubscriberById);
subscriberRoutes.get("/", isAdmin, SubscriberController.getAllSubscribers);
subscriberRoutes.delete(
  "/delete/:id",
  isAdmin,
  SubscriberController.deleteSubscriber
);

export default subscriberRoutes;
