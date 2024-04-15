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
    description: string;
    imageUrl: string | undefined;
    author?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    comments?: string[]; 
    category: string[];
    likes: number;
    tags: string[]; 
}

/**
 * Schema representing the Blog model
 */
        const blogSchema = new Schema<IBlog>({
            title: {
                type: String,
                required: true,
            },

            content: {
            type: Schema.Types.Mixed,
            required: true,
            },
            
            imageUrl: {
                type: String,
                required: false,
            },

            description:{
                type: String,
                required: false,
            },
            author: {
                type: [Schema.Types.ObjectId],
                required: false,
                ref: 'Author',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            comments: {
                type: [Schema.Types.ObjectId],
                ref: 'Comment', 
                required: false,
            },
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

        const Blog = mongoose.model<IBlog>('Blog', blogSchema);

export { Blog };
