
import { User } from '../models/user';
import UserServices from '../services/userServices';



const seedUser = async () => {
    try {
        const UserData = [
            {
            username: 'Holla',
            password: 'Holla@12',
            email: 'jeanpaul@gmail.com',
            phoneNumber: '0798000398',
            fullName: 'Jean Paul Elisa NIYOKWIZERWA',
            role: 'user',
            },
            {
            fullName: "Jean",
            username: "980jjjjjj",
            email: "jeanp@gmail.com",
            password: "9809hjk",
            phoneNumber: "07809098",
            role: "user"
            },
            {
            fullName: "Jean Paul",
            username: "ok",
            email: "jeanpaul@gmail.com",
            password: "234fsdv",
            phoneNumber: "078504308",
            role: "user"
            }
            ];

const len = UserData.length;

for (let i = 0; i < len; i++) {
        const user = new User(UserData[i]);
        await UserServices.userSignup(user);
        console.log(`User ${i} seeded successfully!`);
    }

        console.log('All Users seeded successfully!');
    } catch (error) {
        console.error('Error seeding User:', error);
    }
};

// Seed User
export { seedUser };