/**
 * This file deals with blogs storing and handlings.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 *  Interface representing the structure of a blog document.
 */
export interface IBlog extends Document {
    title: string;
    content: string;
    imageUrl: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
    comments: string[]; 
    category: string[];
    likes: number;
    tags: string[]; 
}

/**
 * Class representing the Blog model
 */


class BlogModel {
    private readonly model: mongoose.Model<IBlog>;
    static model: any;

    constructor() {
        const blogSchema = new Schema<IBlog>({
            title: {
                type: String,
                required: true,
            // ...

            content: {
            type: String,
            required: true,
             },
            },
            author: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: this.getCurrentDate,
            },
            updatedAt: {
                type: Date,
                default: this.getCurrentDate,
            },
            comments: [{
                type: Schema.Types.ObjectId,
                ref: 'Comment', 
            }],
            category: {
                type: [String],
                required: false,
            },
            tags:{
                type: [String],
                rquired: false,
                default: [],
            },
            likes: {
                type: Schema.Types.Mixed,
            },
        });

        this.model = mongoose.model<IBlog>('Blog', blogSchema);
    }

    /**
 * Function to return the current date and time.
 * @returns {Date} Current date and time.
 */
    private getCurrentDate(): Date {
        return new Date();
    }

    // Method to create a new blog document
public static async createBlog(data: Partial<IBlog>): Promise<IBlog | string> {
  try {
    const newBlog = await this.model.create(data);
    await newBlog.save();
    return newBlog;
  } catch (err: any) {
    return err.message;
  }
};

    // Method to find a blog document by ID
    public static async findBlogById(id: string): Promise<IBlog | null> {
        return await this.model.findById(id).exec();
    }

        // Method to find all blog document 
    public static async findAllBlogs(): Promise<IBlog | null> {
        return await this.model.findMany().exec();
    }
    
    // Method to update a blog document
    public static async updateBlog(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

        // Method to delete a blog document
    public static async deleteBlog(id: string): Promise<IBlog | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    // Method to delete a blog document
    public static async deleteAllBlogs(): Promise<any> {
        return await this.model.deleteMany().exec();
    }

    /**
     * Method to find blog documents by category.
     * @param category The category to filter blogs by.
     * @returns Promise resolving to an array of blog documents matching the category.
     */
    public static async findBlogsByCategory(category: string): Promise<IBlog[]> {
        return (await this.model.find({ category }).exec());
    }

    public static async addCommentToBlog(blogId: string, commentId: Types.ObjectId): Promise<void> {
        const blog = await this.model.findById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        blog.comments!.push(commentId.toString()); // Convert commentId to string
        await blog.save();
    }

    public static async incrementLikes(blogId: string): Promise<IBlog | null> {
        const blog = await this.model.findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true });
        return blog;
    }

      public static async getBlogByTitle(query: string): Promise<IBlog | null> {
        const blog = await this.model.findOne({ title: query });
        return blog;
      }
}

export default BlogModel;
