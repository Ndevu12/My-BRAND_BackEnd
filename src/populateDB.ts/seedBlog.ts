import CategoryService  from '../services/blogCategoryService.ts';
import { Blog } from '../models/Blog.ts';
import {Author} from '../models/author.ts';



const seedBlog = async () => {
    try {
        const BlogData = [
            { title: "Programming"},
            { content: "Button and add a name to your test, 123" },
            { description: "button and add a name to your test. You will be redirected to the page from where you can create the tests. Select an endpoint that"},
            { likes: 12},
            { tags: ["Science", "Technology", "Social Life"] }
        ];

        await Blog.insertMany(BlogData);

        console.log('Blog seeded successfully!');
    } catch (error) {
        console.error('Error seeding Blog:\n',{ error: (error as Error).message }, error);
    }
};

// Seed Blog
export { seedBlog };
