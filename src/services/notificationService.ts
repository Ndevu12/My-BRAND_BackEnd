
import { Notification, INotification } from '../models/notification.ts';

class NotificationService {

  /**
     * Method to create a new Notification document.
     * @param data Partial Notification data to create.
     * @const notification =s Promise resolving to the created Notification document.
     */
  static async createNotification(data: Partial<INotification>): Promise<INotification> {
    const notification = await Notification.create(data);
    notification.save();
    return notification;
}

/**
 * Method to find a Notification document by ID.
 * @param id Notification ID.
 * @const notification =s Promise resolving to the found Notification document, or null if not found.
 */
static async findNotificationById(id: string): Promise<INotification | null> {
    const notification = await Notification.findById(id).exec();
    return notification;
}

/**
 * Method to update a Notification document.
 * @param id Notification ID to update.
 * @param data Partial Notification data to update.
 * @const notification =s Promise resolving to the updated Notification document, or null if not found.
 */
static async updateNotification(id: string, data: Partial<INotification>): Promise<INotification | null> {
    const notification = await Notification.findByIdAndUpdate(id, data, { new: true }).exec();
    return notification;
}

/**
 * Method to delete a Notification document.
 * @param id Notification ID to delete.
 * @const notification =s Promise resolving to the deleted Notification document, or null if not found.
 */
static async deleteNotification(id: any): Promise<INotification | null> {
    const notification = await Notification.findByIdAndDelete(id).exec();
    return notification;
}

static async getAllNotifications(): Promise<INotification[]> {
    const notification = await Notification.find().exec();
    return notification;
}

static async deletemany(): Promise<void | any>{
    const notification = await Notification.deleteMany().exec();
    return notification;
}

}

export default NotificationService;
