
import { User } from '../models/user.ts';



const seedUser = async () => {
    try {
        const UserData = [
            {fullname: "Ndevu User"},
            {username: "Ndevu"},
            {email: "ndevulion@gmail.com"},
            {password: "@K1234passkey"},
            {phoneNumber: "0785044398"},
            {role: "admin"}
        ];

        await User.insertMany(UserData);

        console.log('User seeded successfully!');
    } catch (error) {
        console.error('Error seeding User:', error);
    }
};

// Seed User
export { seedUser };
