import Joi from 'joi';
import mongoose from 'mongoose';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Setup DOMPurify with a DOM environment for Node.js
const window = new JSDOM('').window;
const purify = createDOMPurify(window as unknown as any);

// Blog schema validation
export const validateBlog = (blog: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(100).messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title must be at most 100 characters long'
    }),
    slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100).messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen'
    }),
    metaTitle: Joi.string().max(100).messages({
      'string.base': 'Meta title must be a string',
      'string.max': 'Meta title must be at most 100 characters long'
    }),
    metaDescription: Joi.string().max(160).messages({
      'string.base': 'Meta description must be a string',
      'string.max': 'Meta description must be at most 160 characters long'
    }),
    publishDate: Joi.string().isoDate().messages({
      'string.base': 'Publish date must be a string',
      'string.isoDate': 'Publish date must be a valid ISO date'
    }),
    imageCaption: Joi.string().max(200).messages({
      'string.base': 'Image caption must be a string',
      'string.max': 'Image caption must be at most 200 characters long'
    }),
    status: Joi.string().valid('published', 'draft').messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be either published or draft'
    }),
    subtitle: Joi.string().max(200).messages({
      'string.base': 'Subtitle must be a string',
      'string.max': 'Subtitle must be at most 200 characters long'
    }),
    description: Joi.string().required().min(10).max(500).messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must be at most 500 characters long'
    }),
    content: Joi.string().required().min(50).messages({
      'string.base': 'Content must be a string',
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 50 characters long'
    }),
    imageUrl: Joi.string().uri().messages({
      'string.base': 'Image URL must be a string',
      'string.uri': 'Image URL must be a valid URI'
    }),
    author: Joi.alternatives().try(
      Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }),
      Joi.object().instance(mongoose.Types.ObjectId)
    ).required(),
    category: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ).required(),
    tags: Joi.array().items(Joi.string()),
    readTime: Joi.string()
  });

  return schema.validate(blog);
};

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Use DOMPurify for robust HTML sanitization
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'img'
    ],
    ALLOWED_ATTR: [
      'href', 'name', 'target', 'src', 'alt', 'title', 'class', 'id', 'style'
    ],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
};
