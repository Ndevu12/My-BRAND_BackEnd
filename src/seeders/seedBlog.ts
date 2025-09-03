import { Blog } from "../models/Blog";
import { Category } from "../models/blogCategories";
import { User } from "../models/user";
import { UserProfile } from "../models/userProfile";
import { dummyBlogs } from "./data/blogs";
import mongoose from "mongoose";
import { generateUniqueSlug } from "../utils/slugGenerator";

const seedBlog = async (options = { forceUpdate: false }) => {
  try {
    // Check if --force flag is used from command line
    if (process.argv.includes('--force')) {
      options.forceUpdate = true;
    }

    // Find existing categories
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log("No categories found. Please run category seeder first.");
      return;
    }

    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    
    // Create a mapping of category names to their IDs
    for (const category of categories) {
      categoryMap[category.name.toLowerCase()] = category._id as mongoose.Types.ObjectId;
    }
    
    // Find author profiles - get them from existing UserProfiles (seeded by UserProfile seeder)
    const authorProfiles = await UserProfile.find({}).populate('user');
    if (authorProfiles.length === 0) {
      console.log("No UserProfiles found. Please run user and user profile seeders first.");
      return;
    }
    
    console.log(`Found ${authorProfiles.length} author profile(s) to use for blogs.`);
    
    // Use the first profile as default (should be the admin profile)
    
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Process each dummy blog individually
    for (const blog of dummyBlogs) {
      // Map category strings to single category ObjectId
      let categoryId: mongoose.Types.ObjectId | undefined;
      if (blog.category) {
        const categoryKey = blog.category.toLowerCase();
        if (categoryMap[categoryKey]) {
          categoryId = categoryMap[categoryKey];
        } else {
          // If specific category doesn't exist, try to map to closest match
          // For example, "webdev" -> "Web Development"
          const possibleMatch = Object.keys(categoryMap).find(cat => 
            cat.includes(categoryKey) || categoryKey.includes(cat)
          );
          
          if (possibleMatch) {
            categoryId = categoryMap[possibleMatch];
          } else {
            // If no match, assign the first available category
            categoryId = Object.values(categoryMap)[0];
          }
        }
      }

      // If no category could be assigned, skip this blog
      if (!categoryId) {
        console.log(`Skipped blog '${blog.title}': No valid category could be assigned`);
        skippedCount++;
        continue;
      }
      
      // Choose an author profile - randomly select from available profiles
      const authorProfile = authorProfiles.length > 1 
        ? authorProfiles[Math.floor(Math.random() * authorProfiles.length)]
        : authorProfiles[0];
      
      // Check if this blog already exists by title
      const existingBlog = await Blog.findOne({ title: blog.title }) as (mongoose.Document & { _id: mongoose.Types.ObjectId, slug?: string });
      
      if (existingBlog) {
        if (options.forceUpdate) {         
          // Update existing blog
          // Generate unique slug for updated blog if it doesn't have one
          let updateSlug = existingBlog.slug;
          if (!updateSlug) {
            updateSlug = await generateUniqueSlug(blog.title, existingBlog._id.toString());
          }
          
          await Blog.updateOne(
            { _id: existingBlog._id },
            {
              slug: updateSlug, // Ensure slug is present
              metaTitle: blog.title,
              metaDescription: blog.description,
              publishDate: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
              imageCaption: `Featured image for ${blog.title}`,
              status: 'published',
              ...(blog.hasOwnProperty('subtitle') ? { subtitle: (blog as any).subtitle } : {}),
              description: blog.description,
              content: blog.content,
              imageUrl: blog.imageUrl,
              author: authorProfile._id,
              category: categoryId,
              tags: blog.tags || [],
              likes: blog.views || 0,
              readTime: blog.readTime,
              updatedAt: new Date()
            }
          );
          updatedCount++;
          console.log(`Updated blog: ${blog.title} with slug: ${updateSlug}`);
        } else {
          skippedCount++;
          console.log(`Skipped existing blog: ${blog.title}`);
        }
      } else {        
        // Create new blog
        // Generate unique slug for the blog
        const slug = await generateUniqueSlug(blog.title);
        
        await Blog.create({
          title: blog.title,
          slug: slug, // Add the generated slug
          metaTitle: blog.title, // Use title as metaTitle fallback
          metaDescription: blog.description, // Use description as metaDescription fallback
          publishDate: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
          imageCaption: `Featured image for ${blog.title}`,
          status: 'published',
          ...(blog.hasOwnProperty('subtitle') ? { subtitle: (blog as any).subtitle } : {}),
          description: blog.description,
          content: blog.content,
          imageUrl: blog.imageUrl,
          author: authorProfile._id,
          category: categoryId,
          tags: blog.tags || [],
          likes: blog.views || 0,
          readTime: blog.readTime,
          createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
          updatedAt: new Date()
        });
        createdCount++;
        console.log(`Created blog: ${blog.title} with slug: ${slug}`);
      }
    }
    
    // Print summary
    console.log(`\nBlog seeding completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped.`);
  } catch (error) {
    console.error(
      "Error seeding blogs:\n",
      { error: (error as Error).message },
      error
    );
  }
};

// Seed Blog
export { seedBlog };
