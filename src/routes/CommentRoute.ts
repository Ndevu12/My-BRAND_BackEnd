// Import necessary modules
import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { isAdmin, isAdminOrSubscriber } from "../middlewares/authUtils";

const commentRoutes: Router = Router();

commentRoutes.post("/add", CommentController.createComment);
commentRoutes.delete(
  "/:id",
  isAdminOrSubscriber,
  CommentController.deleteComments
);

// Export the router
export default commentRoutes;
