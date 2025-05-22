/**
 * Controller for handling Notification-related operations.
 */
import { Request, Response } from 'express';
import { INotification } from '../models/notification';
import NotificationService from '../services/notificationService';
import response from '../helpers/response';

class notificationController {
    /**
     * Method to create a new notification.
     * @param req Request object containing notification data.
     * @param res Response object to send the result.
     */   static async createNotification(req: Request, res: Response): Promise<void> {
        try {
            const notificationData: Partial<INotification> = req.body;
            const newNotification = await NotificationService.createNotification(notificationData);
            response(res, 201, 'Notification created successfully', newNotification);
        } catch (error) {
            console.error('Error creating notification:', error);
            response(res, 500, 'Internal Server Error', null, 'SERVER_ERROR');
        }
    }

    /**
     * Method to retrieve all notifications.
     * @param req Request object.
     * @param res Response object to send the notifications.
     */   static async getAllNotifications(req: Request, res: Response): Promise<void> {
        try {
            const notifications = await NotificationService.getAllNotifications();
            response(res, 200, 'All notifications retrieved successfully', notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            response(res, 500, 'Internal Server Error', null, 'SERVER_ERROR');
        }
    }

    /**
     * Method to retrieve a notification by its ID.
     * @param req Request object containing the notification ID.
     * @param res Response object to send the notification.
     */   static async getNotificationById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const notification = await NotificationService.findNotificationById(id);
            if (notification) {
                response(res, 200, 'Notification retrieved successfully', notification);
            } else {
                response(res, 404, 'Notification not found', null, 'NOTIFICATION_NOT_FOUND');
            }
        } catch (error) {
            console.error('Error fetching notification by ID:', error);
            response(res, 500, 'Internal Server Error', null, 'SERVER_ERROR');
        }
    }

    /**
     * Method to update a notification by its ID.
     * @param req Request object containing the notification ID and updated data.
     * @param res Response object to send the updated notification.
     */   static async updateNotification(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedNotificationData = req.body;
            const updatedNotification = await NotificationService.updateNotification(id, updatedNotificationData);
            if (updatedNotification) {
                response(res, 200, 'Notification updated successfully', updatedNotification);
            } else {
                response(res, 404, 'Notification not found', null, 'NOTIFICATION_NOT_FOUND');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
            response(res, 500, 'Internal Server Error', null, 'SERVER_ERROR');
        }
    }

    /**
     * Method to delete a notification by its ID.
     * @param req Request object containing the notification ID.
     * @param res Response object to send the result.
     */   static async deleteNotification(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedNotification = await NotificationService.deleteNotification(id);
            if (deletedNotification) {
                response(res, 200, 'Notification deleted successfully', null);
            } else {
                response(res, 404, 'Notification not found', null, 'NOTIFICATION_NOT_FOUND');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            response(res, 500, 'Internal Server Error', null, 'SERVER_ERROR');
        }
    }
}

export default notificationController ;
