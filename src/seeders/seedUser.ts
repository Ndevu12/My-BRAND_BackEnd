
import { User } from '../models/user';



const seedUser = async () => {
    try {
        const UserData = {
            fullName: "Ndevu Not User",
            username: "ndevu fake User",
            email: "ndevulion1233@gmail.com",
            password: "@K1234pas131nonomo",
            phoneNumber: "0785044398",
            role: "user"
            };

        await User.insertMany(UserData);

        console.log('User seeded successfully!');
    } catch (error) {
        console.error('Error seeding User:', error);
    }
};

// Seed User
export { seedUser };
