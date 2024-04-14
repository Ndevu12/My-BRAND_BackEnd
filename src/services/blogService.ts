import { IBlog, Blog } from "../models/Blog.ts";
import { Types } from "mongoose";

class BlogServices {

          /**
         * Method to find blog documents by category.
         * @param category The category to filter blogs by.
         * @returns Promise resolving to an array of blog documents matching the category.
         */
  static async findBlogsByCategory(category: string): Promise<IBlog[]> {
    return (await Blog.find({ category }).exec());
   }


  static async getSingleBlog(query: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ title: query });
    return blog;
  }

  static async createBlog(blogData: { title: string; description: string; author: string; imageURL: string | undefined }): Promise<IBlog> {
    const blog = await Blog.create(blogData);
    return blog;
  }

  static async findBlogById(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findById(blogId);
    return blog;
  }


  static async findAllBlogs() {
    const blogs = await Blog.find()
      .populate("author", "fullname email -_id")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "fullname -_id",
        },
        select: "content",
      });
    return blogs;
  }


  static async updateBlog(blogId: string, blogData: Partial<IBlog>): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndUpdate(blogId, blogData, { new: true });
    return blog;
  }

  static async deleteBlog(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndDelete(blogId);
    return blog;
  }

  static async addCommentToBlog(blogId: string, commentId: Types.ObjectId): Promise<void> {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    blog.comments!.push(commentId.toString());
    await blog.save();
  }
  static async incrementLikes(blogId: string): Promise<IBlog | null> {
    const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true });
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
