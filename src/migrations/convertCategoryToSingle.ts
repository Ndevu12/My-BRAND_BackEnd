/**
 * Migration script to convert blog category field from array to single ObjectId
 * This migration will:
 * 1. Convert blogs with multiple categories to use only the first category
 * 2. Convert single-element category arrays to single ObjectId
 * 3. Handle edge cases where category might be missing or empty
 */

import mongoose from 'mongoose';
import { Blog } from '../models/Blog';
import { Category } from '../models/blogCategories';
import { getEnvVariable } from "../utils/getEnvVariables";

/**
 * Convert category arrays to single category for all existing blogs
 */
async function convertCategoryToSingle(): Promise<void> {
  console.log('🚀 Starting category conversion migration...');

  try {
    // Get all blogs with category data
    const blogs = await Blog.find({}).populate('category').exec();
    console.log(`Found ${blogs.length} blogs to process`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Get a default category in case some blogs don't have categories
    const defaultCategory = await Category.findOne({}) || await Category.create({ 
      name: 'General', 
      icon: 'folder' 
    });

    for (const blog of blogs) {
      try {
        // Get the current category value
        const currentCategory = blog.category as any;
        let newCategoryId: mongoose.Types.ObjectId;

        if (Array.isArray(currentCategory)) {
          if (currentCategory.length > 0) {
            // Use the first category from the array
            newCategoryId = currentCategory[0]._id || currentCategory[0];
            console.log(`✓ Converting blog "${blog.title}" - using first category from array`);
          } else {
            // Empty array, use default category
            newCategoryId = defaultCategory._id as mongoose.Types.ObjectId;
            console.log(`⚠ Blog "${blog.title}" had empty category array - using default category`);
          }
        } else if (currentCategory) {
          // Already a single value, check if it needs conversion
          newCategoryId = currentCategory._id || currentCategory;
          console.log(`→ Blog "${blog.title}" already has single category - keeping it`);
          skippedCount++;
          continue;
        } else {
          // No category at all, use default
          newCategoryId = defaultCategory._id as mongoose.Types.ObjectId;
          console.log(`⚠ Blog "${blog.title}" had no category - using default category`);
        }

        // Update the blog with single category
        await Blog.findByIdAndUpdate(
          blog._id,
          { 
            category: newCategoryId,
            updatedAt: new Date()
          },
          { new: true }
        );

        updatedCount++;

      } catch (error) {
        console.error(`❌ Error processing blog "${blog.title}":`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Results:');
    console.log(`✅ Blogs updated: ${updatedCount}`);
    console.log(`→ Blogs skipped (already single): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback function to convert single categories back to arrays (if needed)
 */
async function rollbackToArrayCategories(): Promise<void> {
  console.log('🔄 Rolling back to array categories...');

  try {
    const blogs = await Blog.find({}).exec();
    console.log(`Found ${blogs.length} blogs to rollback`);

    let updatedCount = 0;

    for (const blog of blogs) {
      try {
        const currentCategory = blog.category as any;
        
        if (!Array.isArray(currentCategory) && currentCategory) {
          // Convert single category back to array
          await Blog.findByIdAndUpdate(
            blog._id,
            { 
              category: [currentCategory],
              updatedAt: new Date()
            },
            { new: true }
          );

          console.log(`✓ Rolled back blog "${blog.title}" to array format`);
          updatedCount++;
        }

      } catch (error) {
        console.error(`❌ Error rolling back blog "${blog.title}":`, error);
      }
    }

    console.log(`✅ Rollback completed! Updated ${updatedCount} blogs`);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    const mongoUri = getEnvVariable("DB_URL") || getEnvVariable("MONGODB_URI") || getEnvVariable("DATABASE_URL");
  const isRollback = process.argv.includes('--rollback');

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(mongoUri!);
  console.log('✅ Connected to MongoDB');

  try {
    if (isRollback) {
      await rollbackToArrayCategories();
    } else {
      await convertCategoryToSingle();
    }
  } finally {
    console.log('🔌 Disconnected from MongoDB');
    await mongoose.disconnect();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
}

export { convertCategoryToSingle, rollbackToArrayCategories };
    function getEnvVariables() {
        throw new Error('Function not implemented.');
    }

