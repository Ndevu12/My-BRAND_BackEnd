import { IBlog, Blog } from "../models/Blog";
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

  static async getSingleBlog(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query });
    return blog;
  }

  static async createBlog(blogData: string): Promise<IBlog> {
    const blog = await Blog.create(blogData);
    return blog.save();
  }
  static async findAllBlogs() {
    const blogs = await Blog.find({}).exec();
    return blogs;
  }

  static async getblogById(id: string): Promise<IBlog | null> {
    const blog = await Blog.findById(id);
    return blog;
  }

  static async updateBlog(
    blogId: string,
    blogData: IBlog
  ): Promise<IBlog | null> {
    console.log("Inside update blog service");
    const blog = await Blog.findByIdAndUpdate(blogId, blogData, { new: true });
    return blog;
  }

  static async deleteBlog(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndDelete(blogId);
    return blog;
  }


  static async updateAuthor(
    BlogId: string,
    newAuthor: Object
  ): Promise<IBlog | null> {
    const blogId = BlogId;
    const Author = newAuthor;
    console.log("Auhtor in updateAuthor service:", newAuthor);
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { author: Author },
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

  // Method to delete a blog document
  static async deleteAllBlogs(): Promise<any> {
    return await Blog.deleteMany();
  }

  /**
   * Updates the status of a blog.
   * @param blogId The ID of the blog to update.
   * @param status The new status of the blog.
   * @returns Promise resolving to the updated blog document, or null if not found.
   */
  static async updateBlogStatus(blogId: string, status: 'published' | 'draft'): Promise<IBlog | null> {
    const id = blogId;
    const updatedBlog = await Blog.findByIdAndUpdate(id, { status }, { new: true });
    return updatedBlog;
  }
}

export default BlogServices;
