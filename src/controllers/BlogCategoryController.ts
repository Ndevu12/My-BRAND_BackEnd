/**
 * Controller for handling Blog Category-related operations.
 */
import { Request, Response } from 'express';
import  CategoryServices from '../services/blogCategoryService.ts';
import {ICategory} from '../models/blogCategories.ts';
class CategoryController {
    /**
     * Method to create a new blog CategoryServices.
     * @param req Request object containing blog category data.
     * @param res Response object to send the result.
     */
    static async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const categoryData: ICategory = req.body;
            const newCategory = await CategoryServices.createCategory(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error creating blog category:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Method to retrieve all blog categories.
     * @param req Request object.
     * @param res Response object to send the blog categories.
     */
    static async getAllBlogCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await CategoryServices.getAllBlogCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching blog categories:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to retrieve a blog category by its ID.
     * @param req Request object containing the category ID.
     * @param res Response object to send the CategoryServices.
     */
    static async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const category = await CategoryServices.findBlogCategoryById(id);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'Blog category not found' });
            }
        } catch (error) {
            console.error('Error fetching blog category by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to update a blog category by its ID.
     * @param req Request object containing the category ID and updated data.
     * @param res Response object to send the updated CategoryServices.
     */
    static async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedCategoryData = req.body;
            const updatedCategory = await CategoryServices.updateBlogCategory(id, updatedCategoryData);
            if (updatedCategory) {
                res.status(200).json(updatedCategory);
            } else {
                res.status(404).json({ error: 'Blog category not found' });
            }
        } catch (error) {
            console.error('Error updating blog category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to delete a blog category by its ID.
     * @param req Request object containing the category ID.
     * @param res Response object to send the result.
     */
    static async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedCategory = await CategoryServices.deleteBlogCategory(id);
            if (deletedCategory) {
                res.status(200).json({ message: 'Blog category deleted successfully' });
            } else {
                res.status(404).json({ error: 'Blog category not found' });
            }
        } catch (error) {
            console.error('Error deleting blog category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default CategoryController;
