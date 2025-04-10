/**
 * This file deals with blogs storing and handlings.
 */

import mongoose, { Schema } from "mongoose";
import { IBlog, ContentImage } from "../types/blog.types";

/**
 * Schema representing content images
 */
const contentImageSchema = new Schema<ContentImage>({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: false
  },
  caption: {
    type: String,
    required: false
  }
});

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
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    }
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
  contentImages: {
    type: [contentImageSchema],
    required: false,
    default: [],
  },
});

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export { Blog };
