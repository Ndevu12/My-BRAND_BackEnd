import { Blog } from "../models/Blog";
import { Category } from "../models/blogCategories";
import { User } from "../models/user";
import { dummyBlogs } from "./data/blogs";
import mongoose from "mongoose";

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
    
    // Find author - using the one created by seedUser
    const defaultAuthor = await User.findOne({ username: "ndevu" });
    if (!defaultAuthor) {
      console.log("No author with username 'ndevu' found. Please run user seeder first.");
      return;
    }
    
    // Find alternate authors for variety
    const alternateAuthors = await User.find({ username: { $ne: "ndevu" } });
    const allAuthors = [defaultAuthor, ...alternateAuthors];    let createdCount = 0;
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
      
      // Choose an author - use the default author or randomly select from available authors
      const authorId = allAuthors.length > 1 
        ? allAuthors[Math.floor(Math.random() * allAuthors.length)]._id 
        : defaultAuthor._id;
      
      // Check if this blog already exists by title
      const existingBlog = await Blog.findOne({ title: blog.title });
      
      if (existingBlog) {
        if (options.forceUpdate) {         
          // Update existing blog
          await Blog.updateOne(
            { _id: existingBlog._id },
            {
              metaTitle: blog.title,
              metaDescription: blog.description,
              publishDate: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
              imageCaption: `Featured image for ${blog.title}`,
              status: 'published',
              ...(blog.hasOwnProperty('subtitle') ? { subtitle: (blog as any).subtitle } : {}),
              description: blog.description,
              content: blog.content,
              imageUrl: blog.imageUrl,
              category: categoryId,
              tags: blog.tags || [],
              likes: blog.views || 0,
              readTime: blog.readTime,
              updatedAt: new Date()
            }
          );
          updatedCount++;
          console.log(`Updated blog: ${blog.title}`);
        } else {
          skippedCount++;
          console.log(`Skipped existing blog: ${blog.title}`);
        }
      } else {        
        // Create new blog
        await Blog.create({
          title: blog.title,
          metaTitle: blog.title, // Use title as metaTitle fallback
          metaDescription: blog.description, // Use description as metaDescription fallback
          publishDate: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
          imageCaption: `Featured image for ${blog.title}`,
          status: 'published',
          ...(blog.hasOwnProperty('subtitle') ? { subtitle: (blog as any).subtitle } : {}),
          description: blog.description,
          content: blog.content,
          imageUrl: blog.imageUrl,
          author: authorId,
          category: categoryId,
          tags: blog.tags || [],
          likes: blog.views || 0,
          readTime: blog.readTime,
          createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
          updatedAt: new Date()
        });
        createdCount++;
        console.log(`Created blog: ${blog.title}`);
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
