// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController';
import { isAdmin } from '../middlewares/authUtils';


const messageRoutes: Router = Router();

// Define routes
messageRoutes.post('/contactme', MessageController.createMessage);
messageRoutes.get('/:id',isAdmin, MessageController.getMessageById);
messageRoutes.get('/',isAdmin, MessageController.getAllMessages);
messageRoutes.delete('/delete/:id', isAdmin, MessageController.deleteMessage);

// messageRoutes.post('/contactme', MessageController.createMessage);
// messageRoutes.get('/:id', MessageController.getMessageById);
// messageRoutes.get('/', MessageController.getAllMessages);
// messageRoutes.delete('/delete/:id', MessageController.deleteMessage);

// Export the router
export default messageRoutes;
