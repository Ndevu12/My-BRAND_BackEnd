import { UserProfile } from '../models/userProfile';
import { User } from '../models/user';

const seedUserProfile = async (options = { forceUpdate: false }) => {
    try {
        // Check if --force flag is used from command line
        if (process.argv.includes('--force')) {
            options.forceUpdate = true;
        }

        console.log('🔄 Starting UserProfile seeding...');

        // Find any admin user (not specifically 'ndevu')
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('❌ No admin user found. Please run user seeder first.');
            return;
        }

        // UserProfile data for the admin user
        const userProfileData = {
            user: adminUser._id,
            firstName: "Jean Paul Elisa",
            lastName: "NIYOKWIZERWA",
            bio: "Full-stack Software Engineer. Passionate about technology, coding, and sharing knowledge through blogging.",
            profileImage: "https://res.cloudinary.com/dtbqhc9ku/image/upload/v1725284653/my_brand_blog/profiles/admin-profile.jpg",
            location: "Kigali, Rwanda",
            website: "https://ndevuspace.com",
            socialLinks: {
                github: "https://github.com/admin",
                linkedin: "https://linkedin.com/in/admin",
                twitter: "https://twitter.com/admin"
            }
        };

        // Check if UserProfile already exists for this user
        const existingProfile = await UserProfile.findOne({ user: adminUser._id });

        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        if (existingProfile) {
            if (options.forceUpdate) {
                // Update the existing UserProfile
                await UserProfile.updateOne(
                    { _id: existingProfile._id },
                    userProfileData
                );
                updatedCount++;
                console.log(`✅ Updated UserProfile for admin user: ${adminUser.username}`);
            } else {
                skippedCount++;
                console.log(`⏭️  Skipped existing UserProfile for: ${adminUser.username}`);
            }
        } else {
            // Create new UserProfile
            const newProfile = await UserProfile.create(userProfileData);
            createdCount++;
            console.log(`✅ Created UserProfile for admin user: ${adminUser.username} (Profile ID: ${newProfile._id})`);
        }

        // Print summary
        console.log(`\n📊 UserProfile seeding completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped.`);
        
        // Return the profile for use by other seeders
        const adminProfile = await UserProfile.findOne({ user: adminUser._id });
        return adminProfile;
        
    } catch (error) {
        console.error('❌ Error seeding UserProfile:', { error: (error as Error).message }, error);
        throw error;
    }
};

export { seedUserProfile };
