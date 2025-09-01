import { Document, Types } from "mongoose";

/**
 * Interface for blog data transfer object
 */
export interface BlogDto {
  title: string;
  slug?: string; // Optional - will be auto-generated if not provided
  metaTitle?: string;
  metaDescription?: string;
  publishDate?: string;
  imageCaption?: string;
  status?: 'published' | 'draft' | 'archived';
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
  slug: string; // Required field for SEO-friendly URLs
  metaTitle?: string;
  metaDescription?: string;
  publishDate?: string;
  imageCaption?: string;
  status?: 'published' | 'draft' | 'archived';
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
