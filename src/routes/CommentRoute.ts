// const necessary modules
import { Router } from 'express';
import CommentController from '../controllers/CommentController.ts';
import { isAdmin } from '../middlewares/authentication.ts';
import { isAdminOrSubscriber } from '../middlewares/authorize.ts';

const  commentRoutes: Router = Router();

// Define routes
 commentRoutes.post('/add',isAdminOrSubscriber, CommentController.createComment);
 commentRoutes.put('/update/:id',isAdminOrSubscriber, CommentController.updateComment);
 commentRoutes.get('/:id', CommentController.getCommentById);
 commentRoutes.get('/', CommentController.getAllComments);
 commentRoutes.delete('/delete/:id', isAdminOrSubscriber, CommentController.deleteComment);

// hijokl
// Export the router
export default commentRoutes;
