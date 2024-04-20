/**
 * This file deals with blogs storing and handlings.
 */

import mongoose, { Schema, Document, Types } from "mongoose";

/**
 *  Interface representing the structure of a blog document.
 */
export interface IBlog extends Document {
  title: string;
  content: string;
  Description: string;
  imageUrl?: string | undefined;
  author?: Object;
  createdAt?: Date;
  updatedAt?: Date;
  comments?: Types.ObjectId[];
  category: Types.ObjectId[];
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
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: false,
  },

  Description: {
    type: String,
    required: false,
  },
  author: {
    type: Object,
    required: true,
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
    type: [Types.ObjectId],
    ref: "Comment",
    required: false,
    default: [],
  },
  category: {
    type: [Types.ObjectId],
    required: true,
    default: [],
  },
  tags: {
    type: [String],
    rquired: true,
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
    required: false,
  },
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export { Blog };
