// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController';
import { isAdmin } from '../middlewares/authUtils';
import UserValidation from '../helpers/validators/validate';

const messageRoutes: Router = Router();

// Define routes
messageRoutes.post('/contact-me', UserValidation.message, MessageController.createMessage);
messageRoutes.get('/:id',isAdmin, MessageController.getMessageById);
messageRoutes.get('/',isAdmin, MessageController.getAllMessages);
messageRoutes.patch('/mark-read/:id', isAdmin, MessageController.markAsRead);
messageRoutes.delete('/delete/:id', isAdmin, MessageController.deleteMessage);

// Export the router
export default messageRoutes;
