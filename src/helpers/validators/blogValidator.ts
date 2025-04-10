import Joi from 'joi';
import mongoose from 'mongoose';

// Blog schema validation
export const validateBlog = (blog: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(100),
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
  // Basic sanitization: remove script tags
  // For production, use a proper HTML sanitizer library like DOMPurify
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
