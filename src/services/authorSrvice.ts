
import { Author, IAuthor } from '../models/author.ts';


class AuthorService{

    /**
     * Method to create a new author document.
     * @param data - Data for the new author.
     * @returns Promise resolving to the created author document.
     */
   static async createAuthor(data: IAuthor): Promise<IAuthor> {
        const createAutho = await Author.create(data);
        return createAutho;
    }

    /**
     * Method to find an author document by ID.
     * @param id - ID of the author to find.
     * @returns Promise resolving to the found author document or null if not found.
     */
   static async findAuthorById(id: string): Promise<IAuthor | null> {
        const AuthorById = await Author.findById(id).exec();
        return AuthorById;
    }

   static async updateAuthor(id: string, data: IAuthor): Promise<IAuthor | null> {
        const update = await Author.findByIdAndUpdate(id, data, { new: true }).exec();
        return update;
    }

    /**
     * Method to delete an Author document.
     * @param id Author ID to delete.
     * @returns Promise resolving to the deleted Author document, or null if not found.
     */
   static async deleteAuthor(id: string): Promise<IAuthor | null> {
        const deletedData = await Author.findByIdAndDelete(id).exec();
        return deletedData;
    }

   static async getAllAuthors(): Promise<IAuthor[]> {
       const allAuthor = await Author.find({}).exec();
        return allAuthor;
    }

}

export default AuthorService;
