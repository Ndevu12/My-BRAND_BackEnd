// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController.ts';
import { isAdmin } from '../middlewares/auth.ts';


const messageRoutes: Router = Router();

// Define routes
messageRoutes.patch('/contactme', MessageController.createMessage);
messageRoutes.get('/:id',isAdmin, MessageController.getMessageById);
messageRoutes.get('/all', isAdmin, MessageController.getAllMessages);
messageRoutes.delete('/delete/:id',isAdmin, MessageController.deleteMessage);

// hijokl
// Export the router
export  default messageRoutes;
