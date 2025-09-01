/**
 * Migration script to add icon field to existing blog categories
 * This script will add default icons to categories that don't have them
 */

import mongoose from "mongoose";
import { Category } from "../models/blogCategories";
import { getEnvVariable } from "../utils/getEnvVariables";

interface MigrationResult {
  success: boolean;
  updated: number;
  errors: string[];
}

// Default icon mappings for existing categories
const DEFAULT_CATEGORY_ICONS: { [key: string]: string } = {
  'web development': 'code',
  'devops': 'cogs',
  'cloud computing': 'cloud',
  'philosophy': 'book',
  'career': 'briefcase',
  'tutorials': 'graduation-cap',
  'architecture': 'sitemap',
  'design': 'palette',
  'technology': 'microchip',
  'mobile development': 'mobile-alt',
  'data science': 'chart-bar',
  'machine learning': 'brain',
  'artificial intelligence': 'robot',
  'cybersecurity': 'shield-alt',
  'blockchain': 'link',
  'gaming': 'gamepad',
  'ui/ux': 'paint-brush',
  'frontend': 'desktop',
  'backend': 'server',
  'fullstack': 'layer-group',
  'database': 'database',
  'api': 'exchange-alt',
  'testing': 'bug',
  'deployment': 'rocket',
  'performance': 'tachometer-alt',
  'security': 'lock',
  'networking': 'network-wired',
  'open source': 'code-branch',
  'startup': 'lightbulb',
  // Add more mappings as needed
  'default': 'folder' // Default icon for unmapped categories
};

/**
 * Get appropriate icon for a category based on its name
 * @param categoryName - The name of the category
 * @returns The icon name
 */
const getIconForCategory = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Try exact match first
  if (DEFAULT_CATEGORY_ICONS[normalizedName]) {
    return DEFAULT_CATEGORY_ICONS[normalizedName];
  }
  
  // Try partial matches for compound names
  for (const [key, icon] of Object.entries(DEFAULT_CATEGORY_ICONS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }
  
  // Return default icon if no match found
  return DEFAULT_CATEGORY_ICONS['default'];
};

/**
 * Migrates existing categories by adding icon field
 * @returns Promise resolving to migration result
 */
export const addIconToExistingCategories = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    updated: 0,
    errors: []
  };

  try {
    // Find all categories without icon field or with null/empty icon
    const categoriesWithoutIcon = await Category.find({
      $or: [
        { icon: { $exists: false } },
        { icon: null },
        { icon: "" }
      ]
    }).select('name _id');

    console.log(`Found ${categoriesWithoutIcon.length} categories without icons`);

    if (categoriesWithoutIcon.length === 0) {
      console.log("All categories already have icons. No migration needed.");
      return result;
    }

    // Process each category
    for (const category of categoriesWithoutIcon) {
      try {
        // Get appropriate icon for this category
        const icon = getIconForCategory(category.name);
        
        // Update the category with the new icon
        await Category.findByIdAndUpdate(category._id, { icon });
        
        result.updated++;
        console.log(`✓ Added icon for category "${category.name}": ${icon}`);
      } catch (error) {
        const errorMsg = `Failed to add icon for category "${category.name}": ${error}`;
        console.error(`✗ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Results: ${result.updated} categories updated, ${result.errors.length} errors`);

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
 * Regenerates all category icons with updated logic
 * @returns Promise resolving to migration result
 */
export const regenerateAllCategoryIcons = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    updated: 0,
    errors: []
  };

  try {
    // Find all categories
    const allCategories = await Category.find({}).select('name _id icon');

    console.log(`Found ${allCategories.length} categories to update icons for`);

    if (allCategories.length === 0) {
      console.log("No categories found. Nothing to migrate.");
      return result;
    }

    // Process each category
    for (const category of allCategories) {
      try {
        // Get new icon for this category
        const newIcon = getIconForCategory(category.name);
        
        // Only update if the icon actually changed
        if (newIcon !== category.icon) {
          await Category.findByIdAndUpdate(category._id, { icon: newIcon });
          result.updated++;
          console.log(`✓ Updated icon for category "${category.name}": ${category.icon || 'null'} → ${newIcon}`);
        } else {
          console.log(`• No change needed for category "${category.name}": ${newIcon}`);
        }
      } catch (error) {
        const errorMsg = `Failed to regenerate icon for category "${category.name}": ${error}`;
        console.error(`✗ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Icon regeneration completed!`);
    console.log(`📊 Results: ${result.updated} categories updated, ${result.errors.length} errors`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      result.success = false;
    }

  } catch (error) {
    console.error('❌ Icon regeneration failed:', error);
    result.success = false;
    result.errors.push(`Icon regeneration failed: ${error}`);
  }

  return result;
};

/**
 * Standalone script to run the migration
 * Can be executed with different commands:
 * - ts-node src/migrations/addIconToCategories.ts (adds icons to categories without them)
 * - ts-node src/migrations/addIconToCategories.ts regenerate (regenerates all category icons)
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
      console.log("🔄 Regenerating all category icons with updated logic...\n");
      result = await regenerateAllCategoryIcons();
    } else {
      console.log("🚀 Adding icons to categories without them...\n");
      result = await addIconToExistingCategories();
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
