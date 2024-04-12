// const necessary modules
import express from 'express';
import SubscriberController from '../controllers/subscriberController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/create', isAdmin, SubscriberController.createSubscriber);
router.put('/update/:id', isAdmin, SubscriberController.updateSubscriber);
router.get('/:id', isAdmin, SubscriberController.getSubscriberById);
router.get('/All', isAdmin, SubscriberController.getAllSubscribers);
router.delete('/delete/:id', isAdmin, SubscriberController.deleteSubscriber);

// hijokl
// Export the router
export default router;
