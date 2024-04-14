import {Category, ICategory} from '../models/blogCategories.ts';



class CategoryService {
  
    /**
     * Method to create a new Category document.
     * @param data Partial Category data to create.
     * @returns Promise resolving to the created Category document.
     */
    static async createCategory(data: ICategory): Promise<ICategory> {
        return (await Category.create(data)).save();
    }

    /**
     * Method to find a Category document by ID.
     * @param id Category ID.
     * @returns Promise resolving to the found Category document, or null if not found.
     */
    static async findBlogCategoryById(id: string): Promise<ICategory | null> {
        return await Category.findById(id).exec();
    }

    /**
     * Method to update a Category document.
     * @param id Category ID to update.
     * @param data Partial Category data to update.
     * @returns Promise resolving to the updated Category document, or null if not found.
     */
    static async updateBlogCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        return await Category.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Method to delete a Category document.
     * @param id Category ID to delete.
     * @returns Promise resolving to the deleted Category document, or null if not found.
     */
    static async deleteBlogCategory(id: string): Promise<ICategory | null> {
        return await Category.findByIdAndDelete(id).exec();
    }

    static async getAllBlogCategories(): Promise<ICategory[]>{
        return await Category.find().exec();
    }

    static async deletemany(): Promise<ICategory | any>{
        return await Category.deleteMany().exec();
    }
}

export default CategoryService;