// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController.ts';
import { isAdmin } from '../middlewares/authentication.ts';


const messageRoutes: Router = Router();

// Define routes
messageRoutes.post('/contactme', MessageController.createMessage);
messageRoutes.get('/:id',isAdmin, MessageController.getMessageById);
messageRoutes.get('/',isAdmin, MessageController.getAllMessages);
messageRoutes.delete('/delete/:id', isAdmin, MessageController.deleteMessage);

// hijokl
// Export the router
export  default messageRoutes;
