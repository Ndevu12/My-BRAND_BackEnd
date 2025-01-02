import { Request, Response } from "express";
import { Blog, IBlog } from "../models/Blog";
import BlogServices from "../services/blogService";
import response from "../helpers/response";
import cloudinary from "../helpers/cloudinary";
import { CustomeRequest } from "../middlewares/authentication";
import mongoose from "mongoose";

/**
 * Controller class responsible for handling blog-related requests.
 */
class blogController {
  /**
   * Creates a new blog post.
   * @param req The request object.
   * @param res The response object.
   */
  static async createBlog(req: Request, res: Response): Promise<void> {
    try {
      console.log({
        body: req.body
        });
      const { title, content, description, category, tags } = req.body;


      if (!title || !content || !description || !tags) {
        response(res, 400, "All fields are required", null, "BAD_REQUEST");
        return;
      }


      let imageURL: string | undefined;
      if (req.file !== undefined) {
        const file = req.file.path;
        const link = await cloudinary.uploader.upload(file);
        imageURL = link.secure_url;
      }

      const blogExists = await BlogServices.getBlogByTitle(title);
      if (blogExists) {
        response(res, 409, "Blog already exists", null, "BLOG_EXISTS");
        return;
      }

      const blogData: any = {
        title,
        Description: description,
        content,
        status: 'published',
        tags: Array.isArray(tags) ? tags : [tags],
      };


      if (imageURL) {
        blogData.imageUrl = imageURL;
      }

      if (category) {
        blogData.category = category.split(',').map((cat: string) => new mongoose.Types.ObjectId(cat.trim()));
      }

      const newBlog = await BlogServices.createBlog(blogData);
      res.status(201).json({ message: "Blog created successfully", newBlog });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json("Sorry, something went wrong");
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
      const { title } = req.body;
      const updatedBlogData: IBlog = req.body;
      const updatedBlog = await BlogServices.updateBlog(id, updatedBlogData);
      if (!updatedBlog) {
        console.log("Blog not found");
        res.status(404).send("Blog not found");
        return;
      }

    res.status(200).json(updatedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).send("Sorry, something went wrong");
    }
  }

  /**
   * Updates the status of a blog to "published".
   * @param req The request object.
   * @param res The response object.
   */
  static async publishBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedBlog = await BlogServices.updateBlogStatus(id, 'published');
      if (!updatedBlog) {
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).json({ message: "Blog published successfully", updatedBlog });
    } catch (error) {
      console.error("Error publishing blog:", error);
      res.status(500).send("Sorry, something went wrong");
    }
  }

  /**
   * Updates the status of a blog to "draft".
   * @param req The request object.
   * @param res The response object.
   */
  static async unpublishBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedBlog = await BlogServices.updateBlogStatus(id, 'draft');
      if (!updatedBlog) {
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).json({ message: "Blog unpublished successfully", updatedBlog });
    } catch (error) {
      console.error("Error unpublishing blog:", error);
      res.status(500).send("Sorry, something went wrong");
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
        res.status(404).send("Blog is not deleted yet");
        return;
      }
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).send("Sorry, something went wrong");
    }
  }


  static async getBlogByTitle(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.params;
      const blog = await BlogServices.getBlogByTitle(title);
      if (!blog) {
        console.log("Blog not found");
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).json(blog);
    } catch (error) {
      console.error("Error fetching blog by title:", error);
      res.status(500).send("Sorry, something went wrong");
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

      if (!blogs || blogs.length === 0) {
        console.log("No blogs found for this category");
        res.status(404).send("No blogs found for this category");
        return;
      } else {
        res.status(200).json(blogs);
        return;
      }
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
      res.status(500).send("Sorry, something went wrong");
    }
  }

  /**
   * Retrieves a specific blog post by ID.
   * @param req The request object.
   * @param res The response object.
   */
  static async getBlogById(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;
      const blog = await Blog.findById(id);

      if (blog == null) {
        return res.status(404).json({
          statuCode: 404,
          error: "blog with the given ID was not found.",
        });
      }

      res.status(200).json({ statuCode: 200, blog });
    } catch (error) {
      res.status(500).json({ statuCode: 500, error: "Something went wrong" });
    }
  }

  /**
   * Method to find all blog documents.
   * @returns Promise resolving to an array of all blog documents.
   */
  static async retrieveAllBlogs(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const blogs = await Blog.find();

      res.status(200).json(blogs);
    } catch (error) {
      return res 
        .status(500)
        .json("Something went wrong");
    }
  }

  /**
   * Retrieves all published blogs ordered by creation date.
   * @param req The request object.
   * @param res The response object.
   */
  static async getPublishedBlogs(req: Request, res: Response): Promise<void> {
    try {
      const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (error) {
      console.log("Error fetching published blogs:", error);
      res.status(500).json("Sorry, something went wrong");
    }
  }
}

export default blogController;
