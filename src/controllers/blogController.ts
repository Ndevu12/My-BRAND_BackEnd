import { Request, Response } from "express";
import { Blog } from "../models/Blog";
import BlogServices from "../services/blogService";
import response from "../helpers/response";
import cloudinary from "../helpers/cloudinary";
import SubscriberService from "../services/subscriberService";
import { Types } from "mongoose";
import { CustomeRequest } from "../middlewares/authentication";
import { Comment } from "../models/comments";
import { BlogDto } from "../types/blog.types";
import { validateBlog, sanitizeHtml, validateContentImages } from "../helpers/validators/blogValidator";

// Define a custom interface that extends Express Request to include file
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

/**
 * Controller class responsible for handling blog-related requests.
 */
class blogController {
  /**
   * Creates a new blog post.
   * @param req The request object.
   * @param res The response object.
   */
  static async createBlog(req: RequestWithFile, res: Response): Promise<void> {
    try {
      let imageURL: string | undefined;
      if (req.file !== undefined) {
        const file = req.file.path;
        const link = await cloudinary.uploader.upload(file);
        imageURL = link.secure_url;
      }

      const { title } = req.body;
      const blogExists = await BlogServices.getBlogByTitle(title);
      if (blogExists) {
        response(res, 409, "Blog already exists", null, "BLOG_EXISTS");
        return;
      }

      const tags = Array.isArray(req.body.tags) ? req.body.tags.map(String) : 
        req.body.tags ? [String(req.body.tags)] : [];
      
      const category = Array.isArray(req.body.category)
        ? req.body.category.map(String)
        : req.body.category ? [String(req.body.category)] : [];

      // Sanitize HTML content
      const sanitizedContent = sanitizeHtml(req.body.content);
      
      // Validate content images
      if (!validateContentImages(sanitizedContent)) {
        res.status(400).json({ 
          status: 400, 
          message: "Invalid image format in content", 
          error: "INVALID_CONTENT_IMAGES" 
        });
        return;
      }

      const blogData: BlogDto = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description || req.body.Description || '',
        content: sanitizedContent,
        imageUrl: imageURL,
        tags: tags,
        category: category,
        author: {
          name: req.body.author?.name || req.body.author || 'Anonymous',
          avatarUrl: req.body.author?.avatarUrl || undefined,
          bio: req.body.author?.bio || undefined
        },
        readTime: req.body.readTime,
        contentImages: req.body.contentImages
      };

      // Validate blog data
      const { error } = validateBlog(blogData);
      if (error) {
        res.status(400).json({ 
          status: 400, 
          message: error.details[0].message, 
          error: "VALIDATION_ERROR" 
        });
        return;
      }

      const newBlog = await BlogServices.createBlog(blogData);
      res.status(201).json({ 
        message: "Blog created successfully", 
        blog: newBlog 
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).send("Sorry, something went wrong");
    }
  }

  /**
   * Updates a specific blog post.
   * @param req The request object.
   * @param res The response object.
   */
  static async updateBlog(req: RequestWithFile, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      let imageURL: string | undefined;
      if (req.file !== undefined) {
        const file = req.file.path;
        const link = await cloudinary.uploader.upload(file);
        imageURL = link.secure_url;
      }

      const blogData: Partial<BlogDto> = {
        ...req.body,
        imageUrl: imageURL || req.body.imageUrl
      };

      // Handle tags and category properly
      if (req.body.tags) {
        blogData.tags = Array.isArray(req.body.tags) ? req.body.tags.map(String) : 
          [String(req.body.tags)];
      }
      
      if (req.body.category) {
        blogData.category = Array.isArray(req.body.category)
          ? req.body.category.map(String)
          : [String(req.body.category)];
      }

      // Format author data properly
      if (req.body.author) {
        if (typeof req.body.author === 'string') {
          blogData.author = {
            name: req.body.author
          };
        } else if (typeof req.body.author === 'object') {
          blogData.author = {
            name: req.body.author.name || 'Anonymous',
            avatarUrl: req.body.author.avatarUrl,
            bio: req.body.author.bio
          };
        }
      }

      const updatedBlog = await BlogServices.updateBlog(id, blogData);
      if (!updatedBlog) {
        console.log("Blog not found");
        res.status(404).send("Blog not found");
        return;
      }

      res.status(200).json({
        message: "Blog updated successfully",
        blog: updatedBlog
      });
    } catch (error) {
      console.error("Error updating blog:", error);
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

  static async likeBlog(req: CustomeRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const blogObjectId = new Types.ObjectId(id);
      const userId = req.user?.id as string;
      const user = await SubscriberService.findSubscriberById(userId);

      const likedBlog = await BlogServices.incrementLikes(id);
      if (!likedBlog) {
        console.log("Unable to add like. Here is the result:", likedBlog);
        response(
          res,
          404,
          "like not added",
          null,
          "Sorry, something went wrong"
        );
        return;
      }

      response(res, 200, "Blog liked successfully", likedBlog);
    } catch (error) {
      console.log("Error adding like to blog", error);
      response(
        res,
        500,
        (error as Error).message || "Sorry, something went wrong",
        null,
        "SERVER_ERROR"
      );
    }
  }

  /**
   * Method to retrieve an author by their ID.
   * @param req Request object containing the author ID.
   * @param res Response object to send the author.
   */
  static async getAuthorByBlogId(req: Request, res: Response): Promise<void> {
    try {
      console.log("in getAuthorByBlogId");
      const { id } = req.params;
      const getBlog = await BlogServices.getblogById(id);
      if (getBlog) {
        const author = await BlogServices.findAuthor(id);
        if (author) {
          res.status(200).json(author);
        } else {
          res.status(404).json({ error: "Author not found" });
        }
      }
    } catch (error) {
      console.error("Error fetching author by ID:", error);
      res.status(500).json({ error: "Sorry something went wrong" });
    }
  }

  /**
   * Method to update an author by their ID.
   * @param req Request object containing the author ID and updated data.
   * @param res Response object to send the updated author.
   */
  static async updateBlogAuthor(req: Request, res: Response): Promise<void> {
    try {
      console.log("in updateBlogAuthor");
      const { id } = req.params;
      const updatedAuthorData = req.body.author;

      const check = await Blog.findById(id);
      if (!check) {
        res.status(404).json({ error: "Blog not found" });
        return;
      }

      const updatedAuthor = await BlogServices.updateAuthor(
        id,
        updatedAuthorData
      );

      console.log("Auhtor in updateAuthor controller:", updatedAuthorData);
      if (!updatedAuthor) {
        res.status(401).json({ error: "Author not updated" });
        return;
      }

      res
        .status(200)
        .json({ Message: "Author updated successfully", updatedAuthor });
    } catch (error) {
      console.error("Error updating author:", error);
      res.status(500).json({ error: "Sorry something went wrong" });
    }
  }

  /**
   * Method to delete an author by their ID.
   * @param req Request object containing the author ID.
   * @param res Response object to send the result.
   */
  static async deleteAuthor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const checkBlog = await BlogServices.getblogById(id);
      if (checkBlog) {
        const deletedAuthor = await BlogServices.deleteAuthor(id);
        if (deletedAuthor) {
          res.status(200).json({ message: "Author deleted successfully" });
        } else {
          res.status(404).json({ error: "Author not found" });
        }
      } else {
        res.status(404).json({ error: "Blog not found" });
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Retrieves a specific blog post by ID.
   * @param req The request object.
   * @param res The response object.
   */
  static async getBlogById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const blog = await Blog.findById(id);

      if (blog == null) {
        res.status(404).json({
          statusCode: 404,
          error: "Blog with the given ID was not found.",
        });
        return;
      }

      const comments = await Comment.find({ postID: blog._id });

      const blogWithComments = {
        _id: blog._id,
        title: blog.title,
        subtitle: blog.subtitle,
        description: blog.description,
        content: blog.content,
        imageUrl: blog.imageUrl,
        author: blog.author,
        updatedAt: blog.updatedAt,
        createdAt: blog.createdAt,
        category: blog.category,
        likes: blog.likes,
        tags: blog.tags,
        readTime: blog.readTime,
        contentImages: blog.contentImages,
        comments,
      };

      res.status(200).json({ statusCode: 200, blog: blogWithComments });
    } catch (error) {
      res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
  }

  /**
   * Method to find all blog documents.
   * @returns Promise resolving to an array of all blog documents.
   */
  static async retrieveAllBlogs(req: Request, res: Response): Promise<void> {
    try {
      const blogs = await BlogServices.findAllBlogs();
      res.status(200).json({ statusCode: 200, blogs });
    } catch (error) {
      res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
  }
}

export default blogController;
