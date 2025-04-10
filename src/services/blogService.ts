import { Blog } from "../models/Blog";
import { IBlog, BlogDto } from "../types/blog.types";
import { Types } from "mongoose";

class BlogServices {
  /**
   * Method to find blog documents by category.
   * @param category The category to filter blogs by.
   * @returns Promise resolving to an array of blog documents matching the category.
   */
  static async findBlogsByCategory(query: string): Promise<IBlog[]> {
    const findBlogByCategor = await Blog.find({ category: query }).exec();
    return findBlogByCategor;
  }

  static async getAllBlogComment(id: string): Promise<IBlog | null> {
    const comments = await Blog.findById(id).populate("comments").exec();
    return comments;
  }

  static async getSingleBlog(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query });
    return blog;
  }

  static async createBlog(blogData: BlogDto): Promise<IBlog> {
    // Extract content images from HTML content if not provided
    if (!blogData.contentImages) {
      const imgRegex = /<img.*?src="(.*?)".*?alt="(.*?)".*?>/g;
      const matches = [...blogData.content.matchAll(imgRegex)];
      
      const contentImages = matches.map(match => ({
        url: match[1],
        alt: match[2],
        caption: ''  // Can be enhanced to extract figcaption if present
      }));
      
      if (contentImages.length > 0) {
        blogData.contentImages = contentImages;
      }
    }
    
    // Calculate read time if not provided
    if (!blogData.readTime) {
      // Average reading speed: 200-250 words per minute
      const wordCount = blogData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200);
      blogData.readTime = `${readTimeMinutes} min read`;
    }
    
    const blog = await Blog.create(blogData);
    return blog;
  }
  
  static async findAllBlogs() {
    const blogs = await Blog.find({}).populate("comments").exec();
    return blogs;
  }

  static async getblogById(id: string): Promise<IBlog | null> {
    const blog = await Blog.findById(id).populate("comments");
    return blog;
  }

  static async updateBlog(
    blogId: string,
    blogData: Partial<BlogDto>
  ): Promise<IBlog | null> {
    console.log("Inside update blog service");
    
    // Update the contentImages if the content has changed
    if (blogData.content && !blogData.contentImages) {
      const imgRegex = /<img.*?src="(.*?)".*?alt="(.*?)".*?>/g;
      const matches = [...blogData.content.matchAll(imgRegex)];
      
      const contentImages = matches.map(match => ({
        url: match[1],
        alt: match[2],
        caption: ''
      }));
      
      if (contentImages.length > 0) {
        blogData.contentImages = contentImages;
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
    );
    return blog;
  }

  static async deleteBlog(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndDelete(blogId);
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
    return blog;
  }

  static async findAuthor(blogId: string): Promise<any> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    const author = blog.author;
    return author;
  }

  static async updateAuthor(
    BlogId: string,
    newAuthor: any
  ): Promise<IBlog | null> {
    const blogId = BlogId;
    console.log("Author in updateAuthor service:", newAuthor);
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { author: newAuthor, updatedAt: new Date() },
      { new: true }
    );
    return updatedBlog;
  }

  static async deleteAuthor(BlogId: string): Promise<IBlog | null> {
    const blogId = BlogId;
    const updatedBlog = await Blog.findByIdAndDelete(blogId);
    return updatedBlog;
  }

  static async getBlogByTitle(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query });
    return blog;
  }

  // Method to delete all blog documents
  static async deleteAllBlogs(): Promise<any> {
    return await Blog.deleteMany();
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
