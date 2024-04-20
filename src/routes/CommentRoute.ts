// const necessary modules
import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { isAdmin } from "../middlewares/authentication";
import { isAdminOrSubscriber } from "../middlewares/authorize";

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

// hijokl
// Export the router
export default commentRoutes;
