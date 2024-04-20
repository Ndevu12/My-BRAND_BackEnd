import { Subscriber } from "../models/Subscriber";

const seedSubscriber = async () => {
  try {
    const SubscriberData = {
      fullname: "subscriptiongmail1@gmail.com",
      email: "subscriber0@gmail.com",
      location: "Kimironko-Kigali",
      likedBlogs: "661cd4e528e17db0050a873e",
    };

    await Subscriber.insertMany(SubscriberData);

    console.log("Subscriber seeded successfully!");
  } catch (error) {
    console.error("Error seeding Subscriber:", error);
  }
};

// Seed Subscriber
export { seedSubscriber };
