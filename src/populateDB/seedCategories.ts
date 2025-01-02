import CategoryService from "../services/blogCategoryService";
import { Category } from "../models/blogCategories";
import { Blog } from "../models/Blog";

// Function to seed categories into the database
const seedCategories = async () => {
  try {
    // array of CategoryService data
    const categoriesData = [
      { name: "Programming" },
      { name: 'Technology' },
      { name: 'Business' },
      { name: 'Social Life' },
      { name: 'Artificial Intelligence' },
    ];

    await Category.insertMany(categoriesData);

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};

// Seed categories
export { seedCategories };
