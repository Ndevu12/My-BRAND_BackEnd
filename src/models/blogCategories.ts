import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing the structure of a category document.
 */
export interface ICategory extends Document {
    name: string; 
}

class BlogCategory {
    private readonly model: mongoose.Model<ICategory>;

    constructor(){
        /**
         * Mongoose schema for the Categories collection.
         */
        const categorySchema = new Schema<ICategory>({
            name: {
                type: String,
                required: true,
                unique: true // Ensures each category name is unique
            }
        });
        this.model = mongoose.model<ICategory>('Category', categorySchema);
    }
    
    
    /**
     * Method to create a new Category document.
     * @param data Partial Category data to create.
     * @returns Promise resolving to the created Category document.
     */
    public async createBlogCategory(data: Partial<ICategory>): Promise<ICategory> {
        return await this.model.create(data);
    }

    /**
     * Method to find a Category document by ID.
     * @param id Category ID.
     * @returns Promise resolving to the found Category document, or null if not found.
     */
    public async findBlogCategoryById(id: string): Promise<ICategory | null> {
        return await this.model.findById(id).exec();
    }

    /**
     * Method to update a Category document.
     * @param id Category ID to update.
     * @param data Partial Category data to update.
     * @returns Promise resolving to the updated Category document, or null if not found.
     */
    public async updateBlogCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Method to delete a Category document.
     * @param id Category ID to delete.
     * @returns Promise resolving to the deleted Category document, or null if not found.
     */
    public async deleteBlogCategory(id: string): Promise<ICategory | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    public async getAllBlogCategories(): Promise<ICategory[]>{
        return await this.model.find().exec();
    }

    public async deletemany(): Promise<ICategory | any>{
        return await this.model.deleteMany().exec();
    }
}
/**
 * Category Model.
 * @typedef Category
 */


export { BlogCategory };
