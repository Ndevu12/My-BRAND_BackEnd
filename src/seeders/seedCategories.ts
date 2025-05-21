import CategoryService from "../services/blogCategoryService";
import { Category } from "../models/blogCategories";
import { Blog } from "../models/Blog";
import mongoose from "mongoose";

// Function to seed categories into the database
const seedCategories = async (options = { forceUpdate: false }) => {
  try {
    // Check if --force flag is used from command line
    if (process.argv.includes('--force')) {
      options.forceUpdate = true;
    }

    // array of categories data
    const categoriesData = [
      { name: "Programming" },
      { name: "Web Development" },
      { name: "UX/UI Design" },
      { name: "Technology" },
      { name: "Career" },
      { name: "Entrepreneurship" },
      { name: "Social" }
    ];

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Process each category individually
    for (const category of categoriesData) {
      // Check if this specific category already exists (case insensitive)
      const exists = await Category.findOne({ 
        name: { $regex: new RegExp(`^${category.name}$`, 'i') } 
      });

      if (!exists) {
        // Create the category if it doesn't exist
        await Category.create(category);
        createdCount++;
        console.log(`✅ Created category: ${category.name}`);
      } else if (options.forceUpdate) {
        // Update the category if forceUpdate is enabled
        await Category.updateOne(
          { _id: exists._id },
          { $set: { name: category.name } } // This ensures correct capitalization
        );
        updatedCount++;
        console.log(`🔄 Updated category: ${category.name}`);
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped existing category: ${category.name}`);
      }
    }

    console.log(`\nCategories seeding complete: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped`);
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};

// Seed categories
export { seedCategories };
