import { Request, Response } from "express";
import { Blog, IBlog } from "../models/Blog.ts";
import BlogServices from "../services/blogService.ts";
import subscriberUtils from "../utils/subscriberUtilities.ts";
import response from "../helpers/response.ts";
import cloudinary from "../helpers/cloudinary.ts";
import SubscriberService from "../services/subscriberService.ts";
import { Types } from "mongoose";
import { CustomeRequest } from "../middlewares/authentication.ts";
import { Category } from "../models/blogCategories.ts";
import { Message } from "../models/messages.ts";
import { Comment } from "../models/comments.ts";

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
      const category = Array.isArray(req.query.category)
        ? req.query.category.map(String)
        : [String(req.query.category)];

      const blogData: any = {
        title: req.body.title,
        Description: req.body.Description,
        content: req.body.content,
        imageUrl: imageURL,
        tags: req.body.tags,
        category: req.body.category,
        author: req.body.author,
      };

      const newBlog = await BlogServices.createBlog(blogData);
      res.status(201).json({ message: "Blog created successfully", newBlog });
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

      /**
       * Notify subscribers about the  ssssssssssssnew updates
       */
      // await subscriberUtils.notifyAllSubscribersAboutUpdates(title, "Blog has been updated");
      res.status(200).json(updatedBlog);
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

      const comments = await Comment.find({ postID: blog._id });

      const blogWithComments = {
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        Description: blog.Description,
        imageUrl: blog.imageUrl,
        updatedAt: blog.updatedAt,
        category: blog.category,
        likes: blog.likes,
        tags: blog.tags,
        comments,
      };

      res.status(200).json({ statuCode: 200, blogWithComments });
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

      const blogsWithComments = [];

      if (blogs.length !== 0) {
        for (const blog of blogs) {
          const comments = await Comment.find({ blog: blog._id });
          const blogWithComments = {
            _id: blog._id,
            title: blog.title,
            content: blog.content,
            Description: blog.Description,
            imageUrl: blog.imageUrl,
            updatedAt: blog.updatedAt,
            category: blog.category,
            likes: blog.likes,
            tags: blog.tags,
            comments,
          };
          blogsWithComments.push(blogWithComments);
        }
      }

      res.status(200).json({ statuCode: 200, blogsWithComments });
    } catch (error) {
      return res
        .status(500)
        .json({ statuCode: 500, error: "Something went wrong" });
    }
  }
}

export default blogController;
