
import { Message } from '../models/messages.ts';



const seedMessage = async () => {
    try {
        const MessageData = [
            { email: 'testing12345@gmail.com' },
            { message: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that' },
        ];

        await Message.insertMany(MessageData);

        console.log('Message seeded successfully!');
    } catch (error) {
        console.error('Error seeding Message:', error);
    }
};

// Seed Message
export { seedMessage };
