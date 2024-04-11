// const necessary modules
import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/notification/:id/createNotification', notificationController.createNotification);
router.put('/notification/:id/updateNotification', notificationController.updateNotification);
router.get('/notification/:id/getNotificationById', notificationController.getNotificationById);
router.get('/notification/getAllNotifications', notificationController.getAllNotifications);
router.delete('/notification/:id/deleteNotification', notificationController.deleteNotification);


// Export the router
export default router;
