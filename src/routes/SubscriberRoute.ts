// const necessary modules
import { Router } from "express";
import SubscriberController from "../controllers/subscriberController";
import { isAdmin } from "../middlewares/authentication";
import UserValidation from "../middlewares/validation/validate";
import { isAdminOrSubscriber } from "../middlewares/authorize";

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

// subscriberRoutes.post('/create', SubscriberController.createSubscriber);
// subscriberRoutes.put('/update/:id', SubscriberController.updateSubscriber);
// subscriberRoutes.get('/:id', SubscriberController.getSubscriberById);
// subscriberRoutes.get('/', SubscriberController.getAllSubscribers);
// subscriberRoutes.delete('/delete/:id', SubscriberController.deleteSubscriber);

export default subscriberRoutes;
