import { Document, Types } from "mongoose";

/**
 * Interface for blog content images
 */
export interface ContentImage {
  url: string;
  alt?: string;
  caption?: string;
  position?: number; // Position in the content (character index)
  id?: string;       // Unique identifier for the image
}

/**
 * Interface for blog data transfer object
 */
export interface BlogDto {
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  category: string | string[];
  tags?: string[];
  readTime?: string;
  contentImages?: ContentImage[];
}

/**
 * Interface representing the structure of a blog document
 */
export interface IBlog extends Document {
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comments?: Types.ObjectId[];
  category: Types.ObjectId[] | string[];
  tags: string[];
  likes: number;
  readTime?: string;
  contentImages?: ContentImage[];
}
