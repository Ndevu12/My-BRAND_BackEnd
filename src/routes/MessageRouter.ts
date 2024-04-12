// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.patch('/contact-me', MessageController.createMessage);
router.get('/:id',isAdmin, MessageController.getMessageById);
router.get('/All', isAdmin, MessageController.getAllMessages);
router.delete('/delete',isAdmin, MessageController.deleteMessage);

// hijokl
// Export the router
export default router;
