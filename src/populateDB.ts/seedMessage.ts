
import { Message } from '../models/messages.ts';



const seedMessage = async () => {
    try {
        const MessageData = {
             email: 'anothertesting12345@gmail.com',
             message: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that',
    };

        await Message.insertMany(MessageData);

        const MessageDatas = {
            email: 'anotheranothertesting12345@gmail.com',
            message: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that',
   };

       await Message.insertMany(MessageDatas);

       const MessageDatasd = {
        email: 'anothernotesting12345@gmail.com',
        message: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that',
};

   await Message.insertMany(MessageDatasd);

        console.log('Message seeded successfully!');
    } catch (error) {
        console.error('Error seeding Message:', error);
    }
};

// Seed Message
export { seedMessage };
