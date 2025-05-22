import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { UserProfile } from '../models/userProfile';
import { Blog } from '../models/Blog';

// Load environment variables
dotenv.config();

/**
 * Migration script to create user profiles for all existing users
 * and update blog references to point to the user profiles instead of directly to users
 */
async function migrateToUserProfiles() {
  try {
    // Connect to the database
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-brand';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    // Create profiles for all users
    const profilePromises = users.map(async (user) => {
      // Check if profile already exists
      const existingProfile = await UserProfile.findOne({ user: user._id });
      if (existingProfile) {
        console.log(`Profile already exists for user: ${user.username}`);
        return existingProfile;
      }

      // Create new profile
      const newProfile = new UserProfile({
        user: user._id,
        firstName: '',
        lastName: '',
        bio: '',
        avatarUrl: ''
      });

      await newProfile.save();
      console.log(`Created profile for user: ${user.username}`);
      return newProfile;
    });

    const profiles = await Promise.all(profilePromises);
    console.log(`Created ${profiles.length} profiles`);

    // Create a mapping of user IDs to profile IDs for easy lookup
    const userToProfileMap = new Map();
    profiles.forEach(profile => {
      userToProfileMap.set(profile.user.toString(), profile._id);
    });

    // Update all blogs to reference user profiles instead of users
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to update`);

    for (const blog of blogs) {
      const authorUserId = blog.author.toString();
      const profileId = userToProfileMap.get(authorUserId);

      if (profileId) {
        blog.author = profileId;
        await blog.save();
        console.log(`Updated blog: ${blog.title}`);
      } else {
        console.log(`No profile found for blog author: ${authorUserId}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateToUserProfiles();
