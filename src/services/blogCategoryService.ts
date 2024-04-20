import { Category, ICategory } from "../models/blogCategories";

class CategoryService {
  /**
   * Method to create a new Category document.
   * @param data Partial Category data to create.
   * @returns Promise resolving to the created Category document.
   */
  static async createCategory(data: ICategory): Promise<ICategory> {
    const category = await Category.create(data);
    category.save();
    return category;
  }

  /**
   * Method to find a Category document by ID.
   * @param id Category ID.
   * @returns Promise resolving to the found Category document, or null if not found.
   */
  static async findBlogCategoryById(id: string): Promise<ICategory | null> {
    const CategoryById = await Category.findById(id).exec();
    return CategoryById;
  }

  static async findCategoryTitle(query: string): Promise<any> {
    const CategoryTitle = await Category.find({ name: query });
    return CategoryTitle;
  }
  /**
   * Method to update a Category document.
   * @param id Category ID to update.
   * @param data Partial Category data to update.
   * @returns Promise resolving to the updated Category document, or null if not found.
   */
  static async updateBlogCategory(
    id: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null> {
    const BlogCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    return BlogCategory;
  }

  /**
   * Method to delete a Category document.
   * @param id Category ID to delete.
   * @returns Promise resolving to the deleted Category document, or null if not found.
   */
  static async deleteBlogCategory(id: string): Promise<ICategory | null> {
    const deleteB = await Category.findByIdAndDelete(id).exec();
    return deleteB;
  }

  static async getAllBlogCategories(): Promise<ICategory[]> {
    const getAll = await Category.find({}).exec();
    return getAll;
  }

  static async deletemany(): Promise<ICategory | any> {
    const deleteAll = await Category.deleteMany().exec();
    return deleteAll;
  }
}

export default CategoryService;
