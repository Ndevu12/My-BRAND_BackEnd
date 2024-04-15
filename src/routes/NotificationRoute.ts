// const necessary modules
import { Router } from 'express';
import NotificationController from '../controllers/notificationController.ts';
import { isAdmin } from '../middlewares/auth.ts';


const  notificationRoutes: Router = Router();

// Define routes
 notificationRoutes.patch('/create', NotificationController.createNotification);
 notificationRoutes.patch('/update/:id', isAdmin, NotificationController.updateNotification);
 notificationRoutes.get('/:id', isAdmin, NotificationController.getNotificationById);
 notificationRoutes.get('/all', NotificationController.getAllNotifications);
 notificationRoutes.delete('/delete/:id', isAdmin, NotificationController.deleteNotification);


// Export the router
export  default notificationRoutes;
