/**
 * Utility functions for generating SEO-friendly slugs
 */

import { Blog } from "../models/Blog";

// Common prefixes/articles to remove from slugs for better SEO
const COMMON_PREFIXES = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'among', 'upon', 'against',
  'within', 'without'
];

/**
 * Removes common prefixes and articles from the beginning of a string
 * @param text - The text to clean
 * @returns Cleaned text without common prefixes
 */
const removeCommonPrefixes = (text: string): string => {
  const words = text.toLowerCase().trim().split(/\s+/);
  
  // Remove common prefixes from the beginning
  while (words.length > 1 && COMMON_PREFIXES.includes(words[0])) {
    words.shift();
  }
  
  return words.join(' ');
};

/**
 * Converts a string into a URL-friendly slug
 * @param text - The text to convert into a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  // First remove common prefixes
  const cleanedText = removeCommonPrefixes(text);
  
  return cleanedText
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Generates a unique slug by checking against existing blogs
 * @param title - The blog title to generate slug from
 * @param excludeId - Optional blog ID to exclude from uniqueness check (for updates)
 * @returns A unique slug
 */
export const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  // Keep checking until we find a unique slug
  while (true) {
    const query = excludeId 
      ? { slug, _id: { $ne: excludeId } }
      : { slug };
    
    const existingBlog = await Blog.findOne(query);
    
    if (!existingBlog) {
      break; // Slug is unique
    }
    
    // Generate new slug with counter
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

/**
 * Validates if a slug has the correct format
 * @param slug - The slug to validate
 * @returns boolean indicating if slug is valid
 */
export const isValidSlugFormat = (slug: string): boolean => {
  // Slug should contain only lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
