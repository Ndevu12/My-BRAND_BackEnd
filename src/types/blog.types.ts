import { Document, Types } from "mongoose";

/**
 * Interface for blog data transfer object
 */
export interface BlogDto {
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  imageUrl?: string;
  author: Types.ObjectId | string; // References UserProfile model
  category: string | string[];
  tags?: string[];
  readTime?: string;
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
  author: Types.ObjectId; // References UserProfile model
  createdAt: Date;
  updatedAt: Date;
  comments?: Types.ObjectId[];
  category: Types.ObjectId[] | string[];
  tags: string[];
  likes: number;
  readTime?: string;
}
