import { connectDb } from "../start-ups/connectdb";
import { seedCategories } from "./seedCategories";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

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
    }

    // Add other seeders here with similar conditional logic
    // if (args.length === 0 || args.includes('users')) {
    //   console.log("\n=== Running User Seeder ===");
    //   await seedUsers();
    // }

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