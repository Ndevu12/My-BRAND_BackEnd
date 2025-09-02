import { Request, Response } from "express";
import { Blog } from "../models/Blog";
import BlogServices from "../services/blogService";
import response from "../helpers/response";
import cloudinary from "../helpers/cloudinary";
import SubscriberService from "../services/subscriberService";
import { Types } from "mongoose";
import { CustomeRequest } from "../middlewares/authUtils";
import { BlogDto, IBlog } from "../types/blog.types";
import { validateBlog, sanitizeHtml } from "../helpers/validators/blogValidator";
import UserProfileService from "../services/userProfileService";

// Define a custom interface that extends Express Request to include file
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

/**
 * Controller class responsible for handling blog-related requests.
 */
class blogController {  /**
   * Creates a new blog post.
   * @param req The request object.
   * @param res The response object.
   */
  static async createBlog(req: CustomeRequest & RequestWithFile, res: Response): Promise<void> {
    try {
      let imageURL: string | undefined;
      
      // Priority: URL takes precedence over file upload
      if (req.body?.imageUrl) {
        // URL provided - use the URL
        imageURL = req.body.imageUrl;
      } else if (req.file !== undefined) {
        // No URL provided, but file uploaded - upload to Cloudinary
        const file = req.file.path;
        const link = await cloudinary.uploader.upload(file);
        imageURL = link.secure_url;
      }

      const { title } = req.body;
      const blogExists = await BlogServices.getBlogByExactTitle(title);
      if (blogExists) {
        response(res, 409, "Blog already exists", null, "BLOG_EXISTS");
        return;
      }// Get the current user ID (author of the blog)
      const userId = req.user?.id;
      if (!userId) {
        response(res, 401, "Unauthorized. Please login first.", null, "UNAUTHORIZED");
        return;
      }

      // Get or create user profile
      let authorProfile;
      try {
        authorProfile = await UserProfileService.createOrGetProfile(userId);
      } catch (error) {
        response(res, 404, "Author user not found", null, "AUTHOR_NOT_FOUND");
        return;
      }

      const tags = Array.isArray(req.body.tags) ? req.body.tags.map(String) : 
        req.body.tags ? [String(req.body.tags)] : [];
      
      // Category should be a single string ID, not an array
      const category = String(req.body.category || '');

      // Sanitize HTML content
      const sanitizedContent = sanitizeHtml(req.body.content);

      const blogData: BlogDto = {
        title: req.body.title,
        slug: req.body.slug, // Optional - will be auto-generated if not provided
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        publishDate: req.body.publishDate,
        imageCaption: req.body.imageCaption,
        status: req.body.status,
        subtitle: req.body.subtitle,
        description: req.body.description || req.body.Description || '',
        content: sanitizedContent,
        imageUrl: imageURL,
        tags: tags,
        category: category,
        author: authorProfile._id as Types.ObjectId, 
        readTime: req.body.readTime
      };// Validate blog data

      const { error } = validateBlog(blogData);
      if (error) {
        response(res, 400, error.details[0].message, null, "VALIDATION_ERROR");
        return;
      }      
      
      const newBlog = await BlogServices.createBlog(blogData);
      response(res, 201, "Blog created successfully", newBlog);    
      } catch (error) {
      console.error("Error creating blog:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }
  /**
   * Updates a specific blog post.
   * @param req The request object.
   * @param res The response object.
   */  static async updateBlog(req: CustomeRequest & RequestWithFile, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Find the blog first to check ownership
      const existingBlog = await BlogServices.getblogById(id);
      if (!existingBlog) {
        response(res, 404, "Blog not found", null, "BLOG_NOT_FOUND");
        return;
      }      // Check if the user is the author of the blog
      const userId = req.user?.id;
      if (!userId || (existingBlog.author._id.toString() !== userId && req.user?.role !== 'admin')) {
        response(res, 403, "You don't have permission to update this blog", null, "FORBIDDEN");
        return;
      }
      
      let imageURL: string | undefined;
      
      // Priority: URL takes precedence over file upload
      if (req.body?.imageUrl !== undefined) {
        // URL provided - use the URL
        imageURL = req.body.imageUrl;
      } else if (req.file !== undefined) {
        // No URL provided, but file uploaded - upload to Cloudinary
        const file = req.file.path;
        const link = await cloudinary.uploader.upload(file);
        imageURL = link.secure_url;
      }

      
      // If content is provided, sanitize it
      if (req.body.content) {
        req.body.content = sanitizeHtml(req.body.content);
      }

      const blogData: Partial<BlogDto> = {
        ...req.body,
        imageUrl: imageURL !== undefined ? imageURL : existingBlog.imageUrl
      };


      // Handle tags and category properly
      if (req.body.tags) {
        blogData.tags = Array.isArray(req.body.tags) ? req.body.tags.map(String) : 
          [String(req.body.tags)];
      }
      
      if (req.body.category) {
        // Category should be a single string ID, not an array
        blogData.category = String(req.body.category);
      }

      // Don't allow changing the author
      delete blogData.author;      
      const updatedBlog = await BlogServices.updateBlog(id, blogData);
      if (!updatedBlog) {
        response(res, 404, "Blog not found", null, "BLOG_NOT_FOUND");
        return;
      }

      response(res, 200, "Blog updated successfully", updatedBlog);    
      } catch (error) {
      console.error("Error updating blog:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
      return;
    }
  }
  /**
   * Deletes a specific blog post.
   * @param req The request object.
   * @param res The response object.
   */
  static async deleteBlog(req: CustomeRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Find the blog first to check ownership
      const existingBlog = await BlogServices.getblogById(id);
      if (!existingBlog) {
        response(res, 404, "Blog not found", null, "BLOG_NOT_FOUND");
        return;
      }      // Check if the user is the author of the blog or an admin
      const userId = req.user?.id;
      if (!userId || (existingBlog.author._id.toString() !== userId && req.user?.role !== 'admin')) {
        response(res, 403, "You don't have permission to delete this blog", null, "FORBIDDEN");
        return;
      }
        const deletedBlog = await BlogServices.deleteBlog(id);
      if (!deletedBlog) {
        response(res, 404, "Blog is not deleted yet", null, "DELETE_FAILED");
        return;
      }
      response(res, 200, "Blog deleted successfully", null);    
      } catch (error) {
      console.error("Error deleting blog:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
      return;
    }
  }
  static async getBlogByTitle(req: Request, res: Response): Promise<void> {
    try {
      // Get title from query parameters instead of params
      const title = req.query.title as string;
      
      // Validate that title is provided and is a string
      if (!title || typeof title !== 'string') {
        response(res, 400, "Title query parameter is required", null, "TITLE_REQUIRED");
        return;
      }

      // Validate minimum length to avoid overly broad searches
      if (title.length < 1) {
        response(res, 400, "Title must be at least 1 character long", null, "TITLE_TOO_SHORT");
        return;
      }
      
      // Get search options from query parameters
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as 'relevance' | 'date' | 'popularity') || 'relevance';
      const includeContent = req.query.includeContent === 'true';
      const useAdvancedSearch = req.query.advanced === 'true';
      
      let blogs: IBlog[];
      
      if (useAdvancedSearch) {
        // Use advanced search with fuzzy matching and relevance scoring
        blogs = await BlogServices.searchBlogsByTitle(title, { 
          limit, 
          sortBy, 
          includeContent 
        });
      } else {
        // Use simple regex search
        blogs = await BlogServices.getBlogByTitle(title);
      }
      
      if (!blogs || blogs.length === 0) {
        response(res, 404, "No blogs found with similar titles", null, "BLOGS_NOT_FOUND");
        return;
      }
      
      response(res, 200, `Found ${blogs.length} blog(s) with similar titles`, {
        blogs,
        searchQuery: title,
        totalResults: blogs.length,
        searchType: useAdvancedSearch ? 'advanced' : 'simple'
      });    
    } catch (error) {
      console.error("Error fetching blogs by title:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
      return;
    }
  }

  /**
   * Get blog by slug for SEO-friendly URLs
   * @param req The request object.
   * @param res The response object.
   */
  static async getBlogBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      
      const blog = await BlogServices.getBlogBySlug(slug);
      if (!blog) {
        response(res, 404, "Blog not found", null, "BLOG_NOT_FOUND");
        return;
      }
      
      response(res, 200, "Blog retrieved successfully", blog);
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }
  /**
   * Method to find blog documents by category with pagination.
   * @param req Request object containing category ID in params and optional page/limit in query
   * @param res Response object
   * @returns Promise resolving to paginated blogs matching the category.
   */
  static async getBlogsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Validate input
      if (!id || id.trim() === '') {
        response(res, 400, "Category ID or name is required", null, "INVALID_INPUT");
        return;
      }
      
      const result = await BlogServices.findBlogsByCategory(id.trim(), limit, page);
      
      if (!result.blogs || result.blogs.length === 0) {
        response(res, 404, "No blogs found for this category", {
          blogs: result.blogs,
          pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalBlogs: result.total,
            blogsPerPage: limit,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            startIndex: (result.page - 1) * limit + 1,
            endIndex: Math.min(result.page * limit, result.total)
          }
        }, "CATEGORY_HAS_NO_BLOGS");
      } else {
        response(res, 200, "Blogs retrieved by category successfully", {
          blogs: result.blogs,
          pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalBlogs: result.total,
            blogsPerPage: limit,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            startIndex: (result.page - 1) * limit + 1,
            endIndex: Math.min(result.page * limit, result.total)
          }
        });
      }    
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to find blog documents by tag with pagination.
   * @param req Request object containing tag in query params and optional page/limit in query
   * @param res Response object
   * @returns Promise resolving to paginated blogs matching the tag.
   */
  static async getBlogsByTags(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const status = req.query.status as string;
      
      // Get tag from query parameters
      const tag = req.query.tag as string;
      
      // Validate input
      if (!tag || tag.trim() === '') {
        response(res, 400, "Tag is required", null, "INVALID_INPUT");
        return;
      }

      // Validate pagination parameters
      if (limit <= 0 || limit > 50) {
        response(res, 400, "Limit must be between 1 and 50", null, "INVALID_LIMIT");
        return;
      }

      if (page <= 0) {
        response(res, 400, "Page must be greater than 0", null, "INVALID_PAGE");
        return;
      }

      // Validate sortBy parameter
      const validSortFields = ['createdAt', 'updatedAt', 'title', 'likes', 'publishDate'];
      if (!validSortFields.includes(sortBy)) {
        response(res, 400, "Invalid sortBy field. Allowed fields: " + validSortFields.join(', '), null, "INVALID_SORT_FIELD");
        return;
      }
      
      const result = await BlogServices.getBlogsByTags(tag.trim(), limit, page, sortBy, sortOrder, status);
      
      response(res, 200, "Blogs retrieved by tag successfully", {
        blogs: result.blogs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalBlogs: result.total,
          blogsPerPage: limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextPage: result.nextPage,
          prevPage: result.prevPage,
          startIndex: (result.page - 1) * limit + 1,
          endIndex: Math.min(result.page * limit, result.total)
        },
        filters: {
          tag: tag.trim(),
          sortBy,
          sortOrder,
          status: status || 'all'
        }
      });    
    } catch (error) {
      console.error("Error fetching blogs by tag:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }

  static async likeBlog(req: CustomeRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const blogObjectId = new Types.ObjectId(id);
      const userId = req.user?.id as string;
      const user = await SubscriberService.findSubscriberById(userId);      const likedBlog = await BlogServices.incrementLikes(id);
      if (!likedBlog) {
        console.log("Unable to add like. Here is the result:", likedBlog);
        response(
          res,
          404,
          "Like not added",
          null,
          "LIKE_FAILED"
        );
        return;
      }

      response(res, 200, "Blog liked successfully", likedBlog);    } catch (error) {
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
   * @param req Request object containing the blog ID.
   * @param res Response object to send the author.
   */
  static async getAuthorByBlogId(req: Request, res: Response): Promise<void> {
    try {
      console.log("in getAuthorByBlogId");
      const { id } = req.params;
      const author = await BlogServices.findAuthor(id);
        if (author) {
        response(res, 200, "Author retrieved successfully", author);
      } else {
        response(res, 404, "Author not found", null, "AUTHOR_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error fetching author by ID:", error);
      response(res, 500, "Sorry something went wrong", null, "SERVER_ERROR");
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
      const blog = await Blog.findById(id).populate('author').populate('comments');      if (blog == null) {
        response(res, 404, "Blog with the given ID was not found", null, "BLOG_NOT_FOUND");
        return;
      }

      response(res, 200, "Blog retrieved successfully", blog);
    } catch (error) {
      response(res, 500, "Something went wrong", null, "SERVER_ERROR");
    }
  }
 
  /**
   * Method to find all blog documents with pagination.
   * @returns Promise resolving to paginated blog documents.
   */
  static async retrieveAllBlogs(req: Request, res: Response): Promise<void> {
    try {
      // Extract pagination and filtering parameters from query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const status = req.query.status as string;

      // Validate pagination parameters
      if (limit <= 0 || limit > 50) {
        response(res, 400, "Limit must be between 1 and 50", null, "INVALID_LIMIT");
        return;
      }

      if (page <= 0) {
        response(res, 400, "Page must be greater than 0", null, "INVALID_PAGE");
        return;
      }

      // Validate sortBy parameter
      const validSortFields = ['createdAt', 'updatedAt', 'title', 'likes', 'publishDate'];
      if (!validSortFields.includes(sortBy)) {
        response(res, 400, "Invalid sortBy field. Allowed fields: " + validSortFields.join(', '), null, "INVALID_SORT_FIELD");
        return;
      }

      // Use the new getAllBlogs service method with enhanced pagination
      const result = await BlogServices.getAllBlogs(limit, page, sortBy, sortOrder, status);
      
      response(res, 200, "All blogs retrieved successfully", {
        blogs: result.blogs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalBlogs: result.total,
          blogsPerPage: limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          nextPage: result.nextPage,
          prevPage: result.prevPage,
          startIndex: (result.page - 1) * limit + 1,
          endIndex: Math.min(result.page * limit, result.total)
        },
        filters: {
          sortBy,
          sortOrder,
          status: status || 'all'
        }
      });
    } catch (error) {
      console.error("Error retrieving all blogs:", error);
      response(res, 500, "Something went wrong", null, "SERVER_ERROR");
    }
  }

/**
   * Method to find all blog documents for admin privileged user with advanced filtering.
   * @returns Promise resolving to paginated blog documents with filters.
   */
  static async adminGetAllBlogs(req: Request, res: Response): Promise<void> {
    try {      // Extract query parameters
      const queryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as string || 'all',
        category: req.query.category as string,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        order: req.query.order as string || 'desc',
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string
      };

      // Validate pagination parameters
      if (queryParams.limit <= 0 || queryParams.limit > 50) {
        response(res, 400, "Limit must be between 1 and 50", null, "INVALID_LIMIT");
        return;
      }

      if (queryParams.page <= 0) {
        response(res, 400, "Page must be greater than 0", null, "INVALID_PAGE");
        return;
      }      // Validate sort parameters
      const validSortFields = ['title', 'publishDate', 'createdAt'];
      if (!validSortFields.includes(queryParams.sortBy)) {
        response(res, 400, "Invalid sort field", null, "INVALID_SORT_FIELD");
        return;
      }

      const validSortOrders = ['asc', 'desc'];
      if (!validSortOrders.includes(queryParams.order)) {
        response(res, 400, "Invalid sort order. Use 'asc' or 'desc'", null, "INVALID_SORT_ORDER");
        return;
      }

      const result = await BlogServices.adminGetAllBlogs(queryParams);
      
      response(res, 200, "Blogs retrieved successfully", result);
    } catch (error) {
      console.error("Error retrieving admin blogs:", error);
      response(res, 500, "Something went wrong", null, "SERVER_ERROR");
    }
  }

  /**
   * Method to get recent blogs with pagination.
   * @param req The request object with optional query params for limit and page.
   * @param res The response object.
   */
  static async getRecentBlogs(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      // Validate pagination parameters
      if (limit <= 0 || limit > 50) {
        response(res, 400, "Limit must be between 1 and 50", null, "INVALID_LIMIT");
        return;
      }

      if (page <= 0) {
        response(res, 400, "Page must be greater than 0", null, "INVALID_PAGE");
        return;
      }

      const result = await BlogServices.getRecentBlogs(limit, page);
      
      response(res, 200, "Recent blogs retrieved successfully", {
        ...result,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalBlogs: result.total,
          limit: limit,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1
        }
      });
    } catch (error) {
      console.error("Error retrieving recent blogs:", error);
      response(res, 500, "Something went wrong", null, "SERVER_ERROR");
    }
  }
}

export default blogController;