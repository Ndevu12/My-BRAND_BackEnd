
import { Author } from '../models/author.ts';



const seedAuthor = async () => {
    try {
        const AuthorData = {
             name: 'Ndevu Author' ,
             postId: '661ceecc1049509e87d63491' 
        };

        await Author.insertMany(AuthorData);

        const AuthorDataS = {
            name: 'Ndevu Author second MUKEMA' ,
            postId: '661ceecb1049509e87d6348f' 
       };

       await Author.insertMany(AuthorDataS);

        console.log('Author seeded successfully!');
    } catch (error) {
        console.error('Error seeding Author:', error);
    }
};

// Seed Author
export { seedAuthor };
