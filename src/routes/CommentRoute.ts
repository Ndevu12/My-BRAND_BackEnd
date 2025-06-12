// Import necessary modules
import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { isAdmin, isAdminOrSubscriber } from "../middlewares/authUtils";

const commentRoutes: Router = Router();

// Public routes
commentRoutes.post("/add", CommentController.createComment);
commentRoutes.get("/blog/:blogId", CommentController.getCommentsByBlogId);

// Protected routes
commentRoutes.put("/:id", isAdminOrSubscriber, CommentController.updateComment);
commentRoutes.delete("/:id", isAdminOrSubscriber, CommentController.deleteComments);

// Export the router
export default commentRoutes;
