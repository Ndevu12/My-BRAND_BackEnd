
import { Notification, INotification } from '../models/notification.ts';

class NotificationService {

  /**
     * Method to create a new Notification document.
     * @param data Partial Notification data to create.
     * @returns Promise resolving to the created Notification document.
     */
  static async createNotification(data: Partial<INotification>): Promise<INotification> {
    return await Notification.create(data);
}

/**
 * Method to find a Notification document by ID.
 * @param id Notification ID.
 * @returns Promise resolving to the found Notification document, or null if not found.
 */
static async findNotificationById(id: string): Promise<INotification | null> {
    return await Notification.findById(id).exec();
}

/**
 * Method to update a Notification document.
 * @param id Notification ID to update.
 * @param data Partial Notification data to update.
 * @returns Promise resolving to the updated Notification document, or null if not found.
 */
static async updateNotification(id: string, data: Partial<INotification>): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(id, data, { new: true }).exec();
}

/**
 * Method to delete a Notification document.
 * @param id Notification ID to delete.
 * @returns Promise resolving to the deleted Notification document, or null if not found.
 */
static async deleteNotification(id: string): Promise<INotification | null> {
    return await Notification.findByIdAndDelete(id).exec();
}

static async getAllNotifications(): Promise<INotification[]> {
    return await Notification.find().exec();
}

static async deletemany(): Promise<void | any>{
    return await Notification.deleteMany().exec();
}

}

export default NotificationService;
