import express from "express";
import blogRoutes from "./BlogRouter";
import blogCategoryRoutes from "./blogCategoryRoute";
import messageRoutes from "./MessageRouter";
import notificationRoutes from "./NotificationRoute";
import adminRoutes from "./userRoutes";


const route = express.Router();

route.use("/blog", blogRoutes);
route.use("/blogCategory", blogCategoryRoutes);
route.use("/message", messageRoutes);
route.use("/notification", notificationRoutes);
route.use("/auth", adminRoutes);

// route.get("/reset", reset.resetSetting);

export default route;
