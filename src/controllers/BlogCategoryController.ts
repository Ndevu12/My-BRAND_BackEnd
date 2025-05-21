/**
 * Controller for handling Blog Category-related operations.
 */
import { Request, Response } from "express";
import CategoryServices from "../services/blogCategoryService";
import { ICategory } from "../models/blogCategories";
import CategoryService from "../services/blogCategoryService";
import response from "../helpers/response";
class CategoryController {  /**
   * Method to create a new blog CategoryServices.
   * @param req Request object containing blog category data.
   * @param res Response object to send the result.
   */  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: ICategory = req.body;
      const { name } = req.body;
      const ifCategoryExist = await CategoryService.findCategoryTitle(name);

      if (ifCategoryExist && ifCategoryExist.length > 0) {
        response(res, 409, "Category already exists", null, "CATEGORY_EXISTS");
        return;
      }
      
      const newCategory = await CategoryServices.createCategory(categoryData);
      response(res, 201, "Category created successfully", newCategory);    } catch (error) {
      console.error("Error creating blog category:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to retrieve all blog categories.
   * @param req Request object.
   * @param res Response object to send the blog categories.
   */  static async getAllBlogCategories(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const categories = await CategoryServices.getAllBlogCategories();
      response(res, 200, "All categories retrieved successfully", categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to retrieve a blog category by its ID.
   * @param req Request object containing the category ID.
   * @param res Response object to send the CategoryServices.
   */  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryServices.findBlogCategoryById(id);
      if (category) {
        response(res, 200, "Category retrieved successfully", category);
      } else {
        response(res, 404, "Category not found", null, "CATEGORY_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error fetching blog category by ID:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to update a blog category by its ID.
   * @param req Request object containing the category ID and updated data.
   * @param res Response object to send the updated CategoryServices.
   */  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedCategoryData = req.body;
      const updatedCategory = await CategoryServices.updateBlogCategory(
        id,
        updatedCategoryData
      );
      if (updatedCategory) {
        response(res, 200, "Category updated successfully", updatedCategory);
      } else {
        response(res, 404, "Category not found", null, "CATEGORY_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error updating blog category:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to delete a blog category by its ID.
   * @param req Request object containing the category ID.
   * @param res Response object to send the result.
   */  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedCategory = await CategoryServices.deleteBlogCategory(id);
      if (deletedCategory) {
        response(res, 200, "Category deleted successfully", null);
      } else {
        response(res, 404, "Category not found", null, "CATEGORY_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error deleting blog category:", error);
      response(res, 500, "Internal Server Error", null, "SERVER_ERROR");
    }
  }
}

export default CategoryController;
