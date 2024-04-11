// const necessary modules
import { Router } from 'express';
import MessageController from '../controllers/MessageController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/Message/:id/createMessage', MessageController.createMessage);
router.put('/Message/:id/updateMessage', MessageController.updateMessage);
router.get('/Message/:id/getMessageById', MessageController.getMessageById);
router.get('/Message/getAllMessages', MessageController.getAllMessages);
router.delete('/Message/:id/deleteMessage', MessageController.deleteMessage);

// hijokl
// Export the router
export default router;
