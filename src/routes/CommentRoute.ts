// const necessary modules
import { Router } from "express";
import CommentController from "../controllers/CommentController.ts";
import { isAdmin } from "../middlewares/authentication.ts";
import { isAdminOrSubscriber } from "../middlewares/authorize.ts";

const commentRoutes: Router = Router();

commentRoutes.post("/add", CommentController.createComment);
commentRoutes.delete("/:id", CommentController.deleteComments);

//  commentRoutes.post('/add',isAdminOrSubscriber, CommentController.createComment);
//  commentRoutes.put('/update/:id',isAdminOrSubscriber, CommentController.updateComment);
//  commentRoutes.get('/:id', CommentController.getCommentById);
//  commentRoutes.get('/', CommentController.getAllComments);
//  commentRoutes.delete('/delete/:id', isAdminOrSubscriber, CommentController.deleteComment);
// commentRoutes.get('/byBlog/:id', CommentController.findCommentByPostID);

// hijokl
// Export the router
export default commentRoutes;
