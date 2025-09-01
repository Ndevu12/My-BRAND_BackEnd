/**
 * Migration script to add slug field to existing blogs
 * This script will generate slugs for all existing blogs that don't have one
 */

import mongoose from "mongoose";
import { Blog } from "../models/Blog";
import { generateUniqueSlug } from "../utils/slugGenerator";
import { getEnvVariable } from "../utils/getEnvVariables";

interface MigrationResult {
  success: boolean;
  updated: number;
  errors: string[];
}

/**
 * Migrates existing blogs by adding slug field
 * @returns Promise resolving to migration result
 */
export const addSlugToExistingBlogs = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    updated: 0,
    errors: []
  };

  try {
    // Find all blogs without slug field
    const blogsWithoutSlug: Array<{ _id: mongoose.Types.ObjectId; title: string }> = await Blog.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    }).select('title _id');

    console.log(`Found ${blogsWithoutSlug.length} blogs without slugs`);

    if (blogsWithoutSlug.length === 0) {
      console.log("All blogs already have slugs. No migration needed.");
      return result;
    }

    // Process each blog
    for (const blog of blogsWithoutSlug) {
      try {
        // Generate unique slug for this blog
        const slug = await generateUniqueSlug(blog.title, blog._id.toString());
        
        // Update the blog with the new slug
        await Blog.findByIdAndUpdate(blog._id, { slug });
        
        result.updated++;
        console.log(`✓ Generated slug for blog "${blog.title}": ${slug}`);
      } catch (error) {
        const errorMsg = `Failed to generate slug for blog "${blog.title}": ${error}`;
        console.error(`✗ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Results: ${result.updated} blogs updated, ${result.errors.length} errors`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      result.success = false;
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
  }

  return result;
};

/**
 * Regenerates all slugs with improved logic (removes common prefixes)
 * @returns Promise resolving to migration result
 */
export const regenerateAllSlugs = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    updated: 0,
    errors: []
  };

  try {
    // Find all blogs with titles
    const allBlogs: Array<{ _id: mongoose.Types.ObjectId; title: string; slug?: string }> = await Blog.find({})
      .select('title _id slug');

    console.log(`Found ${allBlogs.length} blogs to regenerate slugs for`);

    if (allBlogs.length === 0) {
      console.log("No blogs found. Nothing to migrate.");
      return result;
    }

    // Process each blog
    for (const blog of allBlogs) {
      try {
        // Generate new unique slug for this blog with improved logic
        const newSlug = await generateUniqueSlug(blog.title, blog._id.toString());
        
        // Only update if the slug actually changed
        if (newSlug !== blog.slug) {
          await Blog.findByIdAndUpdate(blog._id, { slug: newSlug });
          result.updated++;
          console.log(`✓ Updated slug for blog "${blog.title}": ${blog.slug} → ${newSlug}`);
        } else {
          console.log(`• No change needed for blog "${blog.title}": ${newSlug}`);
        }
      } catch (error) {
        const errorMsg = `Failed to regenerate slug for blog "${blog.title}": ${error}`;
        console.error(`✗ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Slug regeneration completed!`);
    console.log(`📊 Results: ${result.updated} blogs updated, ${result.errors.length} errors`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      result.success = false;
    }

  } catch (error) {
    console.error('❌ Slug regeneration failed:', error);
    result.success = false;
    result.errors.push(`Slug regeneration failed: ${error}`);
  }

  return result;
};

/**
 * Standalone script to run the migration
 * Can be executed with different commands:
 * - ts-node src/migrations/addSlugToBlogs.ts (adds slugs to blogs without them)
 * - ts-node src/migrations/addSlugToBlogs.ts regenerate (regenerates all slugs with improved logic)
 */
const runMigration = async () => {
  try {
    // Get command line argument
    const command = process.argv[2] || 'add';
    
    // Connect to MongoDB
    const mongoUri = getEnvVariable("DB_URL") || getEnvVariable("MONGODB_URI") || getEnvVariable("DATABASE_URL");
    if (!mongoUri) {
      throw new Error("MongoDB connection string not found in environment variables");
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    let result: MigrationResult;

    // Run appropriate migration based on command
    if (command === 'regenerate') {
      console.log("� Regenerating all blog slugs with improved logic...\n");
      result = await regenerateAllSlugs();
    } else {
      console.log("🚀 Adding slugs to blogs without them...\n");
      result = await addSlugToExistingBlogs();
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);

  } catch (error) {
    console.error("💥 Migration script failed:", error);
    
    // Ensure we disconnect even on error
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}
