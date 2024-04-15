
import { Author } from '../models/author.ts';



const seedAuthor = async () => {
    try {
        const AuthorData = [
            { name: 'Ndevu' },
            { postId: '122' }
        ];

        await Author.insertMany(AuthorData);

        console.log('Author seeded successfully!');
    } catch (error) {
        console.error('Error seeding Author:', error);
    }
};

// Seed Author
export { seedAuthor };
