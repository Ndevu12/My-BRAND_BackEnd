import connectDb from "../start-ups/connectdb";
import { seedCategories } from "./seedCategories";
import { seedUser } from "./seedUser";
import { seedBlog } from "./seedBlog";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user";
import { Category } from "../models/blogCategories";
import { Blog } from "../models/Blog";
import { Comment } from "../models/comments";
import { Message } from "../models/messages";
import { Notification } from "../models/notification";
import { Subscriber } from "../models/Subscriber";
import { UserProfile } from "../models/userProfile";

// Load environment variables
dotenv.config();

/**
 * Function to clear all data from the database
 */
async function clearDatabase() {
  console.log("\n🗑️  Clearing all data from database...");
  
  try {
    // Clear all collections in the right order (considering relationships)
    await Comment.deleteMany({});
    console.log("✅ Cleared comments");
    
    await Blog.deleteMany({});
    console.log("✅ Cleared blogs");
    
    await Category.deleteMany({});
    console.log("✅ Cleared categories");
    
    await Notification.deleteMany({});
    console.log("✅ Cleared notifications");
    
    await Message.deleteMany({});
    console.log("✅ Cleared messages");
    
    await Subscriber.deleteMany({});
    console.log("✅ Cleared subscribers");
    
    await UserProfile.deleteMany({});
    console.log("✅ Cleared user profiles");
    
    await User.deleteMany({});
    console.log("✅ Cleared users");
    
    console.log("🎉 Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
}

/**
 * Main function to run all seeders
 */
async function runSeeders() {
  try {
    // Connect to the database
    await connectDb();
    console.log("Connected to database for seeding");

    // Get command line arguments to see which seeders to run
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('categories')) {
      console.log("\n=== Running Category Seeder ===");
      await seedCategories();
    }    // User seeder must run before blog seeder
    if (args.length === 0 || args.includes('users')) {
      console.log("\n=== Running User Seeder ===");
      await seedUser();
    }
    
    if (args.length === 0 || args.includes('blogs')) {
      console.log("\n=== Running Blog Seeder ===");
      await seedBlog();
    }

    console.log("\nAll seeding completed successfully!");
    
    // Close the database connection properly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    
    // Try to close the database connection before exiting
    try {
      await mongoose.connection.close();
    } catch (e) {
      console.error("Error closing database connection:", e);
    }
    
    process.exit(1);
  }
}

// Execute the seeder if this file is run directly
if (require.main === module) {
  runSeeders();
}

export default runSeeders;