
import { Author, IAuthor } from '../models/author.ts';


class AuthorService{

    /**
     * Method to create a new author document.
     * @param data - Data for the new author.
     * @returns Promise resolving to the created author document.
     */
   static async createAuthor(data: IAuthor): Promise<IAuthor> {
        return await Author.create(data);
    }

    /**
     * Method to find an author document by ID.
     * @param id - ID of the author to find.
     * @returns Promise resolving to the found author document or null if not found.
     */
   static async findAuthorById(id: string): Promise<IAuthor | null> {
        return await Author.findById(id).exec();
    }

   static async updateAuthor(id: string, data: IAuthor): Promise<IAuthor | null> {
        return await Author.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Method to delete an Author document.
     * @param id Author ID to delete.
     * @returns Promise resolving to the deleted Author document, or null if not found.
     */
   static async deleteAuthor(id: string): Promise<IAuthor | null> {
        return await Author.findByIdAndDelete(id).exec();
    }

   static async getAllAuthors(): Promise<IAuthor[]> {
        return await Author.find().exec();
    }

}

export default AuthorService;
