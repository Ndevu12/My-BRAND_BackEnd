import { Request, Response } from 'express';
import { IBlog } from '../models/Blog.ts';
import BlogServices from '../services/blogService.ts';
import subscriberUtils  from '../utils/subscriberUtilities.ts';
import response from '../helpers/response.ts';
import cloudinary from '../helpers/cloudinary.ts';
import SubscriberService from '../services/subscriberService.ts';
import { Types } from 'mongoose';
import { CustomeRequest } from '../middlewares/authentication.ts';
import { Category } from '../models/blogCategories.ts';
import { Message } from '../models/messages.ts';


/**
 * Controller class responsible for handling blog-related requests.
 */
class blogController {


         /**
     * Method to find all blog documents.
     * @returns Promise resolving to an array of all blog documents.
     */
    static async retrieveAllBlogs(req: Request, res: Response): Promise<void> {
        try {
            const blogs = await BlogServices.findAllBlogs(); 
            res.status(201).json({ message: 'Blog created successfully', blogs });
        } catch (error) {
            console.error('Error fetching all blogs:', error);
            res.status(500).json({ message: 'Sorry, something went wrong' });
        }
    }
    
    static async getallBlogComments(request: Request, response: Response) {
        try {
            const {id} = request.params;
            const blogComments = await BlogServices.getAllBlogComment(id);
            console.log("Blog Comments retrieved successfully");
            response.status(201).json({ message: 'Comments retrieved successfully', blogComments });
        } catch (error) {
            console.error('Error fetching all comments for blog\n:', error);
            response.status(500).json({ message: 'Sorry, something went wrong' });
        
        }
    }
        /**
     * Creates a new blog post.
     * @param req The request object.
     * @param res The response object.
     */
    static async createBlog(req: Request, res: Response): Promise<void> {
        try {
            let imageURL: string | undefined;
            if (req.file !== undefined) {
                const file = req.file.path;
                const link = await cloudinary.uploader.upload(file);
                imageURL = link.secure_url;
              }

            const { title, content } = req.body;
            const blogExists = await BlogServices.getBlogByTitle(title);
            if (blogExists) {
                response(res, 409, "Blog already exists", null, "BLOG_EXISTS");
                return;
            }
            // const tags = Array.isArray(req.query.tags) ? req.query.tags.map(String) : [String(req.query.tags)];
            const category = Array.isArray(req.query.category) ? req.query.category.map(String) : [String(req.query.category)];
            const authorId = (req as CustomeRequest).user?.id as string;
            
            const blogData: any = {
                title: req.body.title,
                Description: req.body.Description, 
                content: req.body.content,
                imageUrl: imageURL, 
                tags: req.body.tags,
                category: req.body.category, 
                author: authorId
            }

            const newBlog = await BlogServices.createBlog(blogData);
            res.status(201).json({ message: 'Blog created successfully', newBlog });
        } catch (error) {
            console.error('Error creating blog:', error);
            res.status(500).send('Sorry, something went wrong');
        }
    }

    /**
     * Retrieves a specific blog post by ID.
     * @param req The request object.
     * @param res The response object.
     */
    static async getBlogById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const blog = await BlogServices.getblogById(id);
            if (!blog) {
                res.status(404).send('Blog not found');
                return;
            }
            res.json(blog);
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            res.status(500).send('Sorry, something went wrong');
        }
    }

     /**
     * Updates a specific blog post.
     * @param req The request object.
     * @param res The response object.
     */
    static async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const {title} = req.body;
            const updatedBlogData: IBlog = req.body;
            const updatedBlog = await BlogServices.updateBlog(id, updatedBlogData);
            if (!updatedBlog) {
                res.status(404).send('Blog not found');
                return;
            }

              
            /**
             * Notify subscribers about the  ssssssssssssnew updates
             */
            // await subscriberUtils.notifyAllSubscribersAboutUpdates(title, "Blog has been updated");
            res.status(200).json(updatedBlog);

        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).send('Sorry, something went wrong');
        }
    }

     /**
     * Deletes a specific blog post.
     * @param req The request object.
     * @param res The response object.
     */
    static async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const blogExists = await BlogServices.getblogById(id);
            if (!blogExists) {
                response(res, 404, "Blog not found", null, "BLOG_NOT_FOUND");
                return;
            }
            const deletedBlog = await BlogServices.deleteBlog(id);
            if (!deletedBlog) {
                res.status(404).send('Blog is not deleted yet');
                return;
            }
            res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).send('Sorry, something went wrong');
        }
    }

     /**
     * Method to find blog documents by category.
     * @param category The category to filter blogs by.
     * @returns Promise resolving to an array of blog documents matching the category.
     */

    static async getBlogsByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const blogs = await BlogServices.findBlogsByCategory(id);

      if(!blogs  || blogs.length === 0){
           console.log("No blogs found for this category");
            res.status(404).send('No blogs found for this category');
    } else{
            res.status(200).json(blogs);
    }
        } catch (error) {
            console.error('Error fetching blogs by category:', error);
            res.status(500).send('Sorry, something went wrong');
        }
    }



    static async likeBlog(req: CustomeRequest, res: Response): Promise<void> {
        try {
          const { id } = req.params;
          const blogObjectId = new Types.ObjectId(id);
          const userId = req.user?.id as string;
          const user = await SubscriberService.findSubscriberById(userId);

        const likedBlog = await BlogServices.incrementLikes(id);
            if (!likedBlog) {
                console.log("Unable to add like. Here is the result:", likedBlog);
                response(res, 404, "like not added", null, "Sorry, something went wrong");
                return;
            }
  
            response(res, 200, "Blog liked successfully", likedBlog);
        } catch (error) {
            console.log("Error adding like to blog", error);
          response(res, 500, (error as Error).message || "Sorry, something went wrong", null, "SERVER_ERROR");
        }
      }
}

export default blogController;
