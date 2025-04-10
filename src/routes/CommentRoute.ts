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

//  commentRoutes.post('/add',isAdminOrSubscriber, CommentController.createComment);
//  commentRoutes.put('/update/:id',isAdminOrSubscriber, CommentController.updateComment);
//  commentRoutes.get('/:id', CommentController.getCommentById);
//  commentRoutes.get('/', CommentController.getAllComments);
//  commentRoutes.delete('/delete/:id',  CommentController.deleteComment);
// commentRoutes.get('/byBlog/:id', CommentController.findCommentByPostID);

// Export the router
export default commentRoutes;
