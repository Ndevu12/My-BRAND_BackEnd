
import { Subscriber } from '../models/Subscriber.ts';



const seedSubscriber = async () => {
    try {
        const SubscriberData = [
            { full_name: 'subscriptiongmail@gmail.com' },
            { email: 'button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that' },
            {location: 'Gikondo-Kigali'},
            {likedBlogs: [122, 123]}
        ];

        await Subscriber.insertMany(SubscriberData);

        console.log('Subscriber seeded successfully!');
    } catch (error) {
        console.error('Error seeding Subscriber:', error);
    }
};

// Seed Subscriber
export { seedSubscriber };
