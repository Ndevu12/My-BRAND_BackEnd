import express from "express";
import blogRoutes from "./BlogRouter";
import blogCategoryRoutes from "./blogCategoryRoute";
import commentRoutes from "./CommentRoute";
import messageRoutes from "./MessageRouter";
import notificationRoutes from "./NotificationRoute";
import subscriberRoutes from "./SubscriberRoute";
import adminRoutes from "./userRoutes";

// Special porpuse module for testing purposes only
// import reset from "../controllers/reset";

const route = express.Router();

route.use("/blog", blogRoutes);
route.use("/blogCategory", blogCategoryRoutes);
route.use("/comment", commentRoutes);
route.use("/message", messageRoutes);
route.use("/notification", notificationRoutes);
route.use("/subscriber", subscriberRoutes);
route.use("/user", adminRoutes);

// route.get("/reset", reset.resetSetting);

export default route;
