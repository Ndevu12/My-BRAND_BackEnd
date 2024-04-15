import CategoryService  from '../services/blogCategoryService.ts';
import { Category } from '../models/blogCategories.ts';
import { Blog } from '../models/Blog.ts';


// Function to seed categories into the database
const seedCategories = async () => {
    try {
        // array of CategoryService data
        const categoriesData = [
            { name: 'Learning' }
            // { name: 'Business oPERATIONS' },
            // { name: 'PEACE KEEPING' },
            // { name: 'Wild Life' },
            // { name: 'Artificial Intelligence' },
            // { name: 'Future of Humanity' }
        ];

        await Category.insertMany(categoriesData);

        console.log('Categories seeded successfully!');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};

// Seed categories
export { seedCategories };
