import { Blog } from "../models/Blog";
import { IBlog, BlogDto } from "../types/blog.types";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { generateUniqueSlug, isValidSlugFormat } from "../utils/slugGenerator";

class BlogServices {
  /**
   * Method to find blog documents by category ID.
   * @param categoryId The category ID to filter blogs by.
   * @returns Promise resolving to an array of blog documents matching the category.
   */
  static async findBlogsByCategory(categoryId: string): Promise<IBlog[]> {
    try {
      console.log(`🔍 Searching for blogs by category ID: "${categoryId}"`);
      
      // Validate that the categoryId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        console.log(`❌ Invalid category ID format: ${categoryId}`);
        throw new Error('Invalid category ID format');
      }

      // Find blogs by category ObjectId
      const blogs = await Blog.find({ category: new mongoose.Types.ObjectId(categoryId) })
        .populate('author')
        .populate('category', '_id name icon')
        .populate('comments')
        .sort({ createdAt: -1 }) // Sort by newest first
        .exec();
      
      console.log(`📊 Found ${blogs.length} blogs for category ID: ${categoryId}`);
      
      if (blogs.length > 0) {
        const categoryName = blogs[0].category ? (blogs[0].category as any).name : 'Unknown';
        console.log(`📂 Category: ${categoryName}`);
        console.log(`📋 Blog titles found:`, blogs.map(blog => blog.title));
      } else {
        console.log(`⚠️ No blogs found for category ID: ${categoryId}`);
      }
      
      return blogs;
    } catch (error) {
      console.error(`❌ Error in findBlogsByCategory for category ID ${categoryId}:`, error);
      throw error;
    }
  }

  static async getAllBlogComment(id: string): Promise<IBlog | null> {
    const comments = await Blog.findById(id)
      .populate('author')
      .populate("comments")
      .exec();
    return comments;
  }

  static async getSingleBlog(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query })
      .populate('author');
    return blog;
  }

  static async createBlog(blogData: BlogDto): Promise<IBlog> {
    // Generate slug if not provided or if provided slug is invalid
    if (!blogData.slug || !isValidSlugFormat(blogData.slug)) {
      blogData.slug = await generateUniqueSlug(blogData.title);
    } else {
      // If slug is provided and valid, ensure it's unique
      blogData.slug = await generateUniqueSlug(blogData.slug);
    }

    // Calculate read time if not provided
    if (!blogData.readTime) {
      // Average reading speed: 200-250 words per minute
      const wordCount = blogData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200);
      blogData.readTime = `${readTimeMinutes} min read`;
    }
    
    const blog = await Blog.create(blogData);
    return blog.populate('author').then(blog => blog.populate('category', '_id name icon'));
  }
  
  // Method to get all blogs with pagination and filtering options
  static async getAllBlogs(
    limit: number = 10, 
    page: number = 1,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: string
  ): Promise<{ 
    blogs: IBlog[], 
    total: number, 
    page: number, 
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    nextPage: number | null,
    prevPage: number | null 
  }> {
    const skip = (page - 1) * limit;
    
    // Build query filter
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const blogs = await Blog.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('author')
      .populate('comments')
      .populate('category', '_id name icon')
      .exec();
    
    const total = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return {
      blogs,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    };
  }

  // Method to get recent blogs with pagination
  static async getRecentBlogs(limit: number = 10, page: number = 1): Promise<{ blogs: IBlog[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit)
      .populate('author')
      .populate('category', '_id name icon')
      .select('title description imageUrl category tags readTime publishedDate likes author slug') // Added slug to selection
      .exec();
    
    const total = await Blog.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    return {
      blogs,
      total,
      page,
      totalPages
    };
  }

  static async getblogById(id: string): Promise<IBlog | null> {
    const blog = await Blog.findById(id)
      .populate('author')
      .populate('category', '_id name icon')
      .populate("comments");
    return blog;
  }

  static async updateBlog(
    blogId: string,
    blogData: Partial<BlogDto>
  ): Promise<IBlog | null> {
    console.log("Inside update blog service");
    
    // Generate new slug if title has changed or slug is manually provided
    if (blogData.title || blogData.slug) {
      if (blogData.slug && isValidSlugFormat(blogData.slug)) {
        // Use provided slug but ensure uniqueness
        blogData.slug = await generateUniqueSlug(blogData.slug, blogId);
      } else if (blogData.title) {
        // Generate slug from new title
        blogData.slug = await generateUniqueSlug(blogData.title, blogId);
      }
    }
    
    // Update read time if content has changed
    if (blogData.content && !blogData.readTime) {
      const wordCount = blogData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200);
      blogData.readTime = `${readTimeMinutes} min read`;
    }
    
    const blog = await Blog.findByIdAndUpdate(blogId, 
      { 
        ...blogData, 
        updatedAt: new Date() 
      }, 
      { new: true }
    ).populate('author')
    .populate('category', '_id name icon');
    return blog;
  }

  static async deleteBlog(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndDelete(blogId)
      .populate('author')
      .populate('category', '_id name icon');
    return blog;
  }

  static async addCommentToBlog(
    blogId: any,
    commentId: Types.ObjectId
  ): Promise<void> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error(
        "Failed to add comment on blog. Blog not found\nLocation: BlogServices\n"
      );
    }
    blog.comments!.push(commentId);
    await blog.save();
  }

  static async incrementLikes(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    blog.likes = blog.likes + 1;
    await blog.save();
    return blog.populate('author').then(blog => blog.populate('category', '_id name icon'));
  }

  static async findAuthor(blogId: string): Promise<any> {
    const blog = await Blog.findById(blogId).populate('author');
    if (!blog) {
      throw new Error("Blog not found");
    }
    const author = blog.author;
    return author;
  }

  static async getBlogByTitle(query: string): Promise<IBlog[]> {
    // Validate input
    if (!query || typeof query !== 'string') {
      throw new Error('Query parameter must be a non-empty string');
    }

    // Sanitize the query to prevent regex injection
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Search for blogs with similar titles using case-insensitive regex
    const blogs = await Blog.find({ 
      title: { $regex: sanitizedQuery, $options: 'i' } 
    })
      .populate('author')
      .populate('category', '_id name icon')
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(10); // Limit to 10 results to avoid performance issues
    
    return blogs;
  }

  /**
   * Get blog by exact title match (used for checking duplicates during creation)
   * @param title - The exact title to search for
   * @returns Promise resolving to blog document or null
   */
  static async getBlogByExactTitle(title: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: title })
      .populate('author')
      .populate('category', '_id name icon');
    return blog;
  }

  /**
   * Advanced search for blogs by title with fuzzy matching and relevance scoring
   * @param query - The search query
   * @param options - Search options (limit, sortBy)
   * @returns Promise resolving to array of blogs with relevance scoring
   */
  static async searchBlogsByTitle(
    query: string, 
    options: { 
      limit?: number; 
      sortBy?: 'relevance' | 'date' | 'popularity';
      includeContent?: boolean;
    } = {}
  ): Promise<IBlog[]> {
    // Validate input
    if (!query || typeof query !== 'string') {
      throw new Error('Query parameter must be a non-empty string');
    }

    // Sanitize the query to prevent regex injection
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const { limit = 10, sortBy = 'relevance', includeContent = false } = options;
    
    // Build search aggregation pipeline
    const pipeline: any[] = [];
    
    // Match stage - search in title and optionally content
    const matchConditions: any[] = [
      { title: { $regex: sanitizedQuery, $options: 'i' } }
    ];
    
    if (includeContent) {
      matchConditions.push({ description: { $regex: sanitizedQuery, $options: 'i' } });
    }
    
    pipeline.push({
      $match: { $or: matchConditions }
    });
    
    // Add relevance scoring
    pipeline.push({
      $addFields: {
        relevanceScore: {
          $add: [
            // Exact title match gets highest score
            { $cond: [{ $eq: [{ $toLower: '$title' }, query.toLowerCase()] }, 10, 0] },
            // Title starts with query gets high score
            { $cond: [{ $regexMatch: { input: { $toLower: '$title' }, regex: `^${query.toLowerCase()}` } }, 5, 0] },
            // Title contains all words from query
            { $cond: [{ $regexMatch: { input: { $toLower: '$title' }, regex: sanitizedQuery.toLowerCase() } }, 3, 0] },
            // Boost popular blogs slightly
            { $divide: ['$likes', 10] }
          ]
        }
      }
    });
    
    // Sort by relevance or other criteria
    const sortStage: any = {};
    switch (sortBy) {
      case 'relevance':
        sortStage.relevanceScore = -1;
        sortStage.createdAt = -1; // Secondary sort by date
        break;
      case 'date':
        sortStage.createdAt = -1;
        break;
      case 'popularity':
        sortStage.likes = -1;
        sortStage.createdAt = -1;
        break;
    }
    
    pipeline.push({ $sort: sortStage });
    pipeline.push({ $limit: limit });
    
    // Lookup author and category
    pipeline.push({
      $lookup: {
        from: 'userprofiles',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    });
    
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    });
    
    // Convert arrays to single objects
    pipeline.push({
      $addFields: {
        author: { $arrayElemAt: ['$author', 0] },
        category: { $arrayElemAt: ['$category', 0] }
      }
    });
    
    // Remove relevanceScore from final output
    pipeline.push({
      $unset: 'relevanceScore'
    });
    
    const results = await Blog.aggregate(pipeline);
    return results;
  }

  /**
   * Get blog by slug for SEO-friendly URLs
   * @param slug - The slug to search for
   * @returns Promise resolving to blog document or null
   */
  static async getBlogBySlug(slug: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ slug: slug.toLowerCase() })
      .populate('author')
      .populate('category', '_id name icon')
      .populate('comments');
    return blog;
  }

  /**
   * Check if a slug exists (excluding a specific blog ID)
   * @param slug - The slug to check
   * @param excludeId - Optional blog ID to exclude from the check
   * @returns Promise resolving to boolean
   */
  static async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query = excludeId 
      ? { slug: slug.toLowerCase(), _id: { $ne: excludeId } }
      : { slug: slug.toLowerCase() };
    
    const existingBlog = await Blog.findOne(query);
    return !!existingBlog;
  }
  // Method to delete all blog documents
  static async deleteAllBlogs(): Promise<any> {
    return await Blog.deleteMany();
  }
  // Enhanced admin method to get all blogs with essential filtering and pagination
  static async adminGetAllBlogs(queryParams: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    blogs: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
      blogsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
      startIndex: number;
      endIndex: number;
    };
    filters: {
      appliedFilters: {
        status: string | null;
        category: string | undefined;
        search: string | undefined;
        sortBy: string;
        order: string;
        dateFrom: string | undefined;
        dateTo: string | undefined;
      };
      availableCategories: any[];
      statusCounts: {
        all: number;
        published: number;
        draft: number;
        archived: number;
      };
    };
  }> {    const {
      page = 1,
      limit = 10,
      status = 'all',
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      dateFrom,
      dateTo
    } = queryParams;

    // Validate pagination parameters
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 50);
    const skip = (validatedPage - 1) * validatedLimit;

    // Build aggregation pipeline
    const pipeline: any[] = [];

    // Match stage for filtering
    const matchStage: any = {};

    // Status filter (exclude archived unless specifically requested)
    if (status !== 'all') {
      matchStage.status = status;
    }

    // Category filter
    if (category) {
      // Support both category ID and category name/slug
      if (mongoose.Types.ObjectId.isValid(category)) {
        matchStage.category = new mongoose.Types.ObjectId(category);
      } else {
        // If not ObjectId, we'll need to lookup category by name later
        pipeline.push({
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        });
        matchStage['categoryDetails.name'] = { $regex: category, $options: 'i' };
      }    }

    // Date range filter
    if (dateFrom || dateTo) {
      matchStage.createdAt = {};
      if (dateFrom) {
        matchStage.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        matchStage.createdAt.$lte = new Date(dateTo);
      }
    }    // Search filter (title only - keeping it simple)
    if (search) {
      matchStage.title = { $regex: search, $options: 'i' };
    }pipeline.push({ $match: matchStage });

    // Lookup categories - we need _id, name, and icon for frontend operations
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    });

    // Add category details to the document
    pipeline.push({
      $addFields: {
        category: { $arrayElemAt: ['$categoryDetails', 0] }
      }
    });

    // Remove the temporary categoryDetails field
    pipeline.push({
      $unset: 'categoryDetails'
    });

    // Project only the 4 essential fields for admin dashboard
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        category: 1,
        description: 1,
        publishDate: {
          $cond: {
            if: { $eq: ['$status', 'published'] },
            then: '$createdAt',
            else: null
          }
        },
        status: 1
      }
    });    // Sort stage - only allow sorting by title and publishDate (createdAt)
    const sortStage: any = {};
    const sortDirection = order === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'title':
        sortStage.title = sortDirection;
        break;
      case 'publishDate':
      case 'createdAt':
      default:
        sortStage.createdAt = sortDirection;
        break;
    }

    pipeline.push({ $sort: sortStage });

    // Count total documents
    const countPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Blog.aggregate(countPipeline);
    const totalBlogs = totalResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: validatedLimit });

    // Execute main query
    const blogs = await Blog.aggregate(pipeline);

    // Calculate pagination info
    const totalPages = Math.ceil(totalBlogs / validatedLimit);
    const hasNextPage = validatedPage < totalPages;
    const hasPrevPage = validatedPage > 1;
    const nextPage = hasNextPage ? validatedPage + 1 : null;
    const prevPage = hasPrevPage ? validatedPage - 1 : null;
    const startIndex = skip + 1;
    const endIndex = Math.min(skip + validatedLimit, totalBlogs);

    // Get filter data
    const [availableCategories, statusCounts] = await Promise.all([
      // Get available categories with blog counts
      Blog.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        },
        { $unwind: '$categoryDetails' },
        {
          $group: {
            _id: '$categoryDetails._id',
            name: { $first: '$categoryDetails.name' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      // Get status counts
      Blog.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Format status counts
    const statusCountsFormatted = {
      all: totalBlogs,
      published: statusCounts.find(s => s._id === 'published')?.count || 0,
      draft: statusCounts.find(s => s._id === 'draft')?.count || 0,
      archived: statusCounts.find(s => s._id === 'archived')?.count || 0
    };

    return {
      blogs,
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalBlogs,
        blogsPerPage: validatedLimit,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        startIndex,
        endIndex
      },
      filters: {        appliedFilters: {
          status: status !== 'all' ? status : null,
          category,
          search,
          sortBy,
          order,
          dateFrom,
          dateTo
        },
        availableCategories,
        statusCounts: statusCountsFormatted
      }
    };
  }
  
  // New method to extract and save content images
  static async extractContentImages(content: string): Promise<any[]> {
    const imgRegex = /<img.*?src="(.*?)".*?alt="(.*?)".*?>/g;
    const matches = [...content.matchAll(imgRegex)];
    
    return matches.map(match => ({
      url: match[1],
      alt: match[2],
      caption: '' // Can be enhanced to extract figcaption if present
    }));
  }
}

export default BlogServices;
