// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController.ts';
import { isAdmin } from '../middlewares/auth.ts';


const messageRoutes: Router = Router();

// Define routes
messageRoutes.patch('/contact-me', MessageController.createMessage);
messageRoutes.get('/:id',isAdmin, MessageController.getMessageById);
messageRoutes.get('/All', isAdmin, MessageController.getAllMessages);
messageRoutes.delete('/delete',isAdmin, MessageController.deleteMessage);

// hijokl
// Export the router
export  default messageRoutes;
