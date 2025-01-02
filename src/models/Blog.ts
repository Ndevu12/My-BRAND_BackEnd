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
  createdAt?: Date;
  updatedAt?: Date;
  category: Types.ObjectId[];
  tags: string[];
  status: 'published' | 'draft' | 'archived';
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: [Types.ObjectId],
    required: false,
    default: [],
  },
  tags: {
    type: [String],
    rquired: true,
    default: [],
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft',
  }
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export { Blog };
