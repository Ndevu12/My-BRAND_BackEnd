import express from "express";
import blogRoutes from "./BlogRouter.ts";
import blogCategoryRoutes from "./blogCategoryRoute.ts";
import commentRoutes from "./CommentRoute.ts";
import messageRoutes from "./MessageRouter.ts";
import notificationRoutes from "./NotificationRoute.ts";
import subscriberRoutes from "./SubscriberRoute.ts";
import adminRoutes from "./userRoutes.ts";

// Special porpuse module for testing purposes only
import reset from "../controllers/reset.ts";

const route = express.Router();

route.use("/blog", blogRoutes);
route.use("/blogCategory", blogCategoryRoutes);
route.use("/comment", commentRoutes);
route.use("/message", messageRoutes);
route.use("/notification", notificationRoutes);
route.use("/subscriber", subscriberRoutes);
route.use("/user", adminRoutes);

route.get("/reset", reset.resetSetting);

export default route;
