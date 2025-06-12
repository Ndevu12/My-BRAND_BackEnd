import { Blog } from "../models/Blog";
import { IBlog, BlogDto } from "../types/blog.types";
import { Types } from "mongoose";
import mongoose from "mongoose";

class BlogServices {
  /**
   * Method to find blog documents by category.
   * @param category The category to filter blogs by.
   * @returns Promise resolving to an array of blog documents matching the category.
   */
  static async findBlogsByCategory(query: string): Promise<IBlog[]> {
    const findBlogByCategor = await Blog.find({ category: query })
      .populate('author')
      .exec();
    return findBlogByCategor;
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
    // Calculate read time if not provided
    if (!blogData.readTime) {
      // Average reading speed: 200-250 words per minute
      const wordCount = blogData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200);
      blogData.readTime = `${readTimeMinutes} min read`;
    }
    
    const blog = await Blog.create(blogData);
    return blog.populate('author');
  }
  
  static async findAllBlogs() {
    const blogs = await Blog.find({})
      .populate('author')
      .populate("comments")
      .exec();
    return blogs;
  }

  // Method to get recent blogs with pagination
  static async getRecentBlogs(limit: number = 10, page: number = 1): Promise<{ blogs: IBlog[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit)
      .populate('author')
      .select('title description imageUrl category tags readTime createdAt likes author') // Select only necessary fields for performance
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
      .populate("comments");
    return blog;
  }

  static async updateBlog(
    blogId: string,
    blogData: Partial<BlogDto>
  ): Promise<IBlog | null> {
    console.log("Inside update blog service");
    
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
    ).populate('author');
    return blog;
  }

  static async deleteBlog(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndDelete(blogId).populate('author');
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
    return blog.populate('author');
  }

  static async findAuthor(blogId: string): Promise<any> {
    const blog = await Blog.findById(blogId).populate('author');
    if (!blog) {
      throw new Error("Blog not found");
    }
    const author = blog.author;
    return author;
  }

  static async getBlogByTitle(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query }).populate('author');
    return blog;
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
        matchStage.category = { $in: [new mongoose.Types.ObjectId(category)] };
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

    // Lookup only categories - we only need category names
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
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
