// const necessary modules
import express from 'express';
import SubscriberController from '../controllers/subscriberController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/Subscriber/:id/createSubscriber', SubscriberController.createSubscriber);
router.put('/Subscriber/:id/updateSubscriber', SubscriberController.updateSubscriber);
router.get('/Subscriber/:id/getSubscriberById', SubscriberController.getSubscriberById);
router.get('/Subscriber/:id/getAllSubscribers', SubscriberController.getAllSubscribers);
router.delete('/Subscriber/:id/deleteSubscriber', SubscriberController.deleteSubscriber);

// hijokl
// Export the router
export default router;
