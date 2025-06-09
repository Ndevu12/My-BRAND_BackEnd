// subscriberServices.ts

import { sendNotificationByEmail } from "./notificationUtility";
import SubscriberService from "../services/subscriberService";

// Service to handle subscriber operations
class subscriberUtils {
  static async notifySubscriberOnSubscription(
    subscriberEmail: string
  ): Promise<void> {
    try {
      const message =
        "You have subscribed to NdevuSpace.com successfully! Thank you for subscribing.";
      await sendNotificationByEmail(
        subscriberEmail,
        "Subscribed to NdevuSpace.com Successfully",
        message
      );
    } catch (error) {
      console.error("Error notifying subscriber on subscription:", error);
      throw new Error("Failed to notify subscriber on subscription");
    }
  }

  static async notifyAllSubscribersAboutUpdates(
    blogTitle: string,
    message: string
  ): Promise<void> {
    try {
      const subscribers = await SubscriberService.getAllSubscribers();
      for (const subscriber of subscribers) {
        await sendNotificationByEmail(subscriber.email, blogTitle, message);
      }
    } catch (error) {
      console.error("Error notifying all subscribers about updates:", error);
      throw new Error("Failed to notify all subscribers about updates");
    }
  }
}

export default subscriberUtils;
