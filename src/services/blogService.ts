import { IBlog, Blog } from "../models/Blog.ts";
import { Types } from "mongoose";

class BlogServices {

          /**
         * Method to find blog documents by category.
         * @param category The category to filter blogs by.
         * @returns Promise resolving to an array of blog documents matching the category.
         */
  static async findBlogsByCategory(query: string): Promise<IBlog[]> {
    const findBlogByCategor =  await Blog.find({category: query }).exec();
    return findBlogByCategor;
   }

   static async getAllBlogComment(id: string): Promise<IBlog | null> {
    const comments  = await Blog.findById(id).populate("comments").exec();
    return comments;
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

  static async updateBlog(blogId: string, blogData: IBlog): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndUpdate(blogId, blogData, { new: true });
    return blog;
  }

  static async deleteBlog(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndDelete(blogId);
    return blog;
  }

  static async addCommentToBlog(blogId: any, commentId: Types.ObjectId): Promise<void> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Failed to add comment on blog. Blog not found\nLocation: BlogServices\n");
    }
    blog.comments!.push(commentId);
    await blog.save();
  }

  static async incrementLikes(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    // const like = blog.likes + 1;
    blog.likes! = blog.likes! + 1;
    await blog.save();
    return blog;
  }

   static async getBlogByTitle(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query });
    return blog;
  }

    // Method to delete a blog document
   static async deleteAllBlogs(): Promise<any> {
      return await Blog.deleteMany().exec();
    }
}


export default BlogServices;
