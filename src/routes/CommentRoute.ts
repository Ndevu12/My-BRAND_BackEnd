// const necessary modules
import { Router } from 'express';
import CommentController from '../controllers/CommentController.ts';

const  commentRoutes: Router = Router();

// Define routes
 commentRoutes.post('/add', CommentController.createComment);
 commentRoutes.put('/update/:id', CommentController.updateComment);
 commentRoutes.get('/:id', CommentController.getCommentById);
 commentRoutes.get('/', CommentController.getAllComments);
 commentRoutes.delete('/delete/:id', CommentController.deleteComment);

// hijokl
// Export the router
export default commentRoutes;
