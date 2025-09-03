
import { User } from '../models/user';
import * as cryptoJs from '../helpers/cryptoJs';

const seedUser = async (options = { forceUpdate: false }) => {
    try {
        // Check if --force flag is used from command line
        if (process.argv.includes('--force')) {
            options.forceUpdate = true;
        }

        // Array of user data
        const usersData = [
            {
                username: "ndevu",
                email: "ndevu@example.com",
                password: "@StrongPassword123",
                role: "admin",
                verified: true
            },
            {
                username: "regularuser",
                email: "user@example.com",
                password: "@User123",
                role: "user",
                verified: true
            }
        ];

        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        // Process each user individually
        for (const userData of usersData) {
            // Check if this specific user already exists
            const existingUser = await User.findOne({ 
                $or: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            });

            if (existingUser) {
                if (options.forceUpdate) {
                    // Hash the password before updating
                    const hashedPassword = await cryptoJs.generate(userData.password);
                    
                    // Update the existing user
                    await User.updateOne(
                        { _id: existingUser._id },
                        { 
                            ...userData,
                            password: hashedPassword
                        }
                    );
                    updatedCount++;
                    console.log(`Updated user: ${userData.username}`);
                } else {
                    skippedCount++;
                    console.log(`Skipped existing user: ${userData.username}`);
                }
            } else {
                // Hash the password before creating
                const hashedPassword = await cryptoJs.generate(userData.password);
                
                // Create new user
                await User.create({
                    ...userData,
                    password: hashedPassword
                });
                createdCount++;
                console.log(`Created user: ${userData.username}`);
            }        }
        
        // Print summary
        console.log(`\nUser seeding completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped.`);
    } catch (error) {
        console.error('Error seeding User:', { error: (error as Error).message }, error);
    }
};

// Seed User
export { seedUser };
