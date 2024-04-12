// const necessary modules
import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.patch('/create', notificationController.createNotification);
router.patch('/update/:id', isAdmin, notificationController.updateNotification);
router.get('/:id', isAdmin, notificationController.getNotificationById);
router.get('/All', notificationController.getAllNotifications);
router.delete('/delete/:id', isAdmin, notificationController.deleteNotification);


// Export the router
export default router;
