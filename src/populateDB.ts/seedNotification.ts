
import { Notification } from '../models/notification.ts';



const seedNotification = async () => {
    try {
        const NotificationData = [
            { title: 'Button and add a name to your test.' },
            { description: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that' },
        ];

        await Notification.insertMany(NotificationData);

        console.log('Notification seeded successfully!');
    } catch (error) {
        console.error('Error seeding Notification:', error);
    }
};

// Seed Notification
export { seedNotification };
