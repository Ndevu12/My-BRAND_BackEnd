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
    title: Joi.string().required().min(5).max(100),
    metaTitle: Joi.string().max(100),
    metaDescription: Joi.string().max(160),
    publishDate: Joi.string().isoDate(),
    imageCaption: Joi.string().max(200),
    status: Joi.string().valid('published', 'draft'),
    subtitle: Joi.string().max(200),
    description: Joi.string().required().min(10).max(500),
    content: Joi.string().required().min(50),
    imageUrl: Joi.string().uri(),
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
