import connectDb from "../start-ups/connectdb";
import { seedCategories } from "./seedCategories";
import { seedUser } from "./seedUser";
import { seedUserProfile } from "./seedUserProfile";
import { seedBlog } from "./seedBlog";
import { clearEntireDatabase } from "./clearDatabase";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

/**
 * SEEDER USAGE GUIDE:
 * 
 * Basic seeding (preserves existing data):
 * - yarn seed                    // Seeds all collections
 * - yarn seed:categories         // Seeds only categories
 * - yarn seed:users              // Seeds only users
 * - yarn seed:profiles           // Seeds only user profiles
 * - yarn seed:blogs              // Seeds only blogs
 * 
 * Force mode (updates existing records):
 * - yarn seed:categories:force   // Updates existing categories
 * - yarn seed:users:force        // Updates existing users
 * - yarn seed:profiles:force     // Updates existing user profiles
 * - yarn seed:blogs:force        // Updates existing blogs
 * 
 * Database clearing and reset:
 * - yarn db:clear               // CLEARS entire database (no seeding)
 * - yarn db:reset               // CLEARS entire database (no seeding)
 * - yarn db:fresh               // CLEARS database + seeds all collections
 * 
 * IMPORTANT: --force only affects individual seeders (updates records)
 *           --clear-all or --reset-db completely wipes the database
 */

/**
 * Main function to run all seeders
 */
async function runSeeders() {
  try {
    // Connect to the database
    await connectDb();
    console.log("Connected to database for seeding");

    // Get command line arguments
    const args = process.argv.slice(2);
    const isForceMode = args.includes('--force');
    const isClearMode = args.includes('--clear-all') || args.includes('--reset-db');
    const isFullSeed = args.length === 0 || args.includes('all');
    
    // Only clear database if explicitly requested with --clear-all or --reset-db
    if (isClearMode) {
      console.log("\n⚠️  CLEAR DATABASE MODE - This will delete ALL existing data!");
      console.log("⏳ Starting in 3 seconds...");
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      await clearEntireDatabase();
      console.log("✅ Database cleared successfully");
    } else if (isForceMode) {
      console.log("\n⚠️  FORCE MODE - This will update existing records if they exist");
    }

    // Determine which seeders to run
    const shouldRunCategories = isFullSeed || args.includes('categories');
    const shouldRunUsers = isFullSeed || args.includes('users');
    const shouldRunProfiles = isFullSeed || args.includes('profiles');
    const shouldRunBlogs = isFullSeed || args.includes('blogs');

    // Run seeders in the correct order (dependencies first)
    if (shouldRunUsers) {
      console.log("\n=== Running User Seeder ===");
      await seedUser({ forceUpdate: isForceMode });
    }

    if (shouldRunProfiles) {
      console.log("\n=== Running UserProfile Seeder ===");
      await seedUserProfile({ forceUpdate: isForceMode });
    }

    if (shouldRunCategories) {
      console.log("\n=== Running Category Seeder ===");
      await seedCategories({ forceUpdate: isForceMode });
    }
    
    if (shouldRunBlogs) {
      console.log("\n=== Running Blog Seeder ===");
      await seedBlog({ forceUpdate: isForceMode });
    }

    console.log("\n🎉 All seeding completed successfully!");
    
    // Print summary
    if (isClearMode) {
      console.log("\n📊 Summary: Database was cleared and reseeded with fresh data");
    } else if (isForceMode) {
      console.log("\n📊 Summary: Seeding completed with force mode (existing records updated)");
    } else {
      console.log("\n📊 Summary: Seeding completed (existing data preserved)");
    }
    
    // Close the database connection properly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    
    // Try to close the database connection before exiting
    try {
      await mongoose.connection.close();
    } catch (e) {
      console.error("❌ Error closing database connection:", e);
    }
    
    process.exit(1);
  }
}

// Execute the seeder if this file is run directly
if (require.main === module) {
  runSeeders();
}

export { runSeeders as default, clearEntireDatabase };