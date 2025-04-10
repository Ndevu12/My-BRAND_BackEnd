import Joi from 'joi';

// Blog schema validation
export const validateBlog = (blog: any) => {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(100),
    subtitle: Joi.string().max(200),
    description: Joi.string().required().min(10).max(500),
    content: Joi.string().required().min(50),
    imageUrl: Joi.string().uri(),
    author: Joi.alternatives().try(
      Joi.string(),
      Joi.object({
        name: Joi.string().required(),
        avatarUrl: Joi.string().uri(),
        bio: Joi.string()
      })
    ).required(),
    category: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ).required(),
    tags: Joi.array().items(Joi.string()),
    readTime: Joi.string(),
    contentImages: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string(),
        caption: Joi.string(),
        position: Joi.number(),
        id: Joi.string()
      })
    )
  });

  return schema.validate(blog);
};

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (html: string): string => {
  // Basic sanitization: remove script tags
  // For production, use a proper HTML sanitizer library like DOMPurify
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Validate content has proper image tags
export const validateContentImages = (content: string): boolean => {
  const imgTags = content.match(/<img.*?src="(.*?)".*?>/g) || [];
  
  for (const imgTag of imgTags) {
    // Check if img tag has proper src attribute
    if (!imgTag.includes('src=')) {
      return false;
    }
  }
  
  return true;
};
