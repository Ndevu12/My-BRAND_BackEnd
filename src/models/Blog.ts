/**
 * This file deals with blogs storing and handlings.
 */

import mongoose, { Schema } from "mongoose";
import { IBlog } from "../types/blog.types";

/**
 * Schema representing the Blog model
 */
const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  description: {
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    required: false,
    default: [],
  },
  category: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
    required: true,
    default: [],
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
    required: false,
  },
  readTime: {
    type: String,
    required: false,
  },
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export { Blog };
