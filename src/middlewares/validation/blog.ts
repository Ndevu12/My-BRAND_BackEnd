import Joi from "joi";

const createBlogSchema = Joi.object({
  title: Joi.string()
    .min(4)
    .required()
    .messages({
      "string.base": "Title must be a string.",
      "string.min": "Title must be at least 4 characters long.",
      "any.required": "Title is required."
    }),
  content: Joi.string()
    .required()
    .messages({
      "string.base": "Content must be a string.",
      "any.required": "Content is required."
    }),
  Description: Joi.string()
    .optional()
    .messages({
      "string.base": "Description must be a string."
    }),
  imageUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.base": "Image URL must be a valid URI."
    }),
  category: Joi.array()
    .items(Joi.string().hex().length(24))
    .optional()
    .messages({
      "array.base": "Category must be an array of ObjectId strings.",
      "string.hex": "Category must be a valid ObjectId string.",
      "string.length": "Category must be a valid ObjectId string."
    }),
  tags: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      "array.base": "Tags must be an array of strings.",
      "any.required": "Tags are required."
    })
});

export default createBlogSchema;