import { Request, Response } from 'express';
import { BlogModel, IBlog } from '../models/Blog.ts';
import { subscriberService } from '../services/subscriberService.ts';
import response from '../helpers/response.ts';
import cloudinary from '../helpers/cloudinary.ts';
import { subscriberModel} from '../models/Subscriber.ts';
import { Types } from 'mongoose';
import { CustomeRequest } from '../middlewares/auth.ts';

const SubscriberModel = new subscriberModel();
const SubscriberService =  new subscriberService();
/**
 * Controller class responsible for handling blog-related requests.
 */
class blogController {

        /**
     * Creates a new blog post.
     * @param req The request object.
     * @param res The response object.
     */
    public async createBlog(req: Request, res: Response): Promise<void> {
        try {
            let imageURL: string | undefined;
            if (req.file !== undefined) {
                const file = req.file.path;
                const link = await cloudinary.uploader.upload(file);
                imageURL = link.secure_url;
              }

            const { title, content } = req.body;
            const blogExists = await BlogModel.getBlogByTitle(title);
            if (blogExists) {
                response(res, 409, "Blog already exists", null, "BLOG_EXISTS");
                return;
            }
            const tags = Array.isArray(req.query.tags) ? req.query.tags.map(String) : [String(req.query.tags)];
            const category = Array.isArray(req.query.category) ? req.query.category.map(String) : [String(req.query.category)];
            const authorId = (req as CustomeRequest).user?.id as string;
            const blogData = {
                title,
                content,
                imageUrl: imageURL,
                tags: tags,
                category: category, 
                author: authorId,
            }

            const newBlog = await BlogModel.createBlog(blogData);

            /**
             * Notify subscribers about the  new updates
             */
            await SubscriberService.notifyAllSubscribersAboutUpdates(title, "New blog is available now on NdevuSpace.com");
            res.status(201).json(newBlog);
        } catch (error) {
            console.error('Error creating blog:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Retrieves a specific blog post by ID.
     * @param req The request object.
     * @param res The response object.
     */
    public async getBlogById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const blog = await BlogModel.findBlogById(id);
            if (!blog) {
                res.status(404).send('Blog not found');
                return;
            }
            res.json(blog);
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            res.status(500).send('Internal Server Error');
        }
    }

     /**
     * Updates a specific blog post.
     * @param req The request object.
     * @param res The response object.
     */
    public async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const {title} = req.body;
            const updatedBlogData: Partial<IBlog> = req.body;
            const updatedBlog = await BlogModel.updateBlog(id, updatedBlogData);
            if (!updatedBlog) {
                res.status(404).send('Blog not found');
                return;
            }

              
            /**
             * Notify subscribers about the  new updates
             */
            await SubscriberService.notifyAllSubscribersAboutUpdates(title, "Blog has been updated");
            res.json(updatedBlog);

        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).send('Internal Server Error');
        }
    }

     /**
     * Deletes a specific blog post.
     * @param req The request object.
     * @param res The response object.
     */
    public async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const blogExists = await BlogModel.findBlogById(id);
            if (!blogExists) {
                response(res, 404, "Blog not found", null, "BLOG_NOT_FOUND");
                return;
            }
            const deletedBlog = await BlogModel.deleteBlog(id);
            if (!deletedBlog) {
                res.status(404).send('Blog is not deleted yet');
                return;
            }
            res.json(deletedBlog);
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).send('Internal Server Error');
        }
    }

     /**
     * Method to find blog documents by category.
     * @param category The category to filter blogs by.
     * @returns Promise resolving to an array of blog documents matching the category.
     */

    public async getBlogsByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { category } = req.params;
            const blogs = await BlogModel.findBlogsByCategory(category);
            res.json(blogs);
        } catch (error) {
            console.error('Error fetching blogs by category:', error);
            res.status(500).send('Internal Server Error');
        }
    }

     /**
     * Method to find all blog documents.
     * @returns Promise resolving to an array of all blog documents.
     */
    public async getAllBlogs(req: Request, res: Response): Promise<void> {
        try {
            const blogs = await BlogModel.findAllBlogs(); // Call the findAllBlogs method
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async likeBlog(req: CustomeRequest, res: Response): Promise<void> {
        try {
          const { blogId } = req.params;
          const blogObjectId = new Types.ObjectId(blogId);
          const userId = req.user?.id as string;
          const user = await SubscriberModel.findSubscriberById(userId);
        if (!user) {
            response(res, 404, "You need to Subscriber to Like this blog", null, "USER_NOT_FOUND");
            return;
        }
        if ((user.likedBlogs ?? []).includes(blogObjectId.toString())) {
            response(
                res,
                400,
                "You have already liked this blog",
                null,
                "ALREADY_LIKED"
            );
            return;
        }
        const likedBlog = await BlogModel.incrementLikes(blogId);
            if (!likedBlog) {
                response(res, 404, "Blog not found", null, "NOT_FOUND");
                return;
            }
            user.likedBlogs = user.likedBlogs ?? [];
            user.likedBlogs.push(blogObjectId.toString()); 
            await user.save();
            response(res, 200, "Blog liked successfully", likedBlog);
        } catch (error) {
          response(
            res,
            500,
            (error as Error).message || "Internal Server Error",
            null,
            "SERVER_ERROR"
          );
        }
      }
}

export { blogController };
