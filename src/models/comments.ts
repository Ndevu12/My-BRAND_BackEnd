/**
 * This file handles the Comments collection.
 */

import mongoose, { Schema, Document, model } from "mongoose";
import Joi from "joi";
/**
 * Interface representing the structure of a comment document.
 */
export interface IComment extends Document {
  blogId: Schema.Types.ObjectId;
  name: string;
  email: string;
  content: string;
  createdAt?: Date;
}

/**
 * schema representing the Comment model.
 */

const commentSchema = new Schema<IComment>({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model<IComment>("Comment", commentSchema);

const validateComment = (
  comment: Pick<IComment, "content" | "blogId" | "name" | "email">
): Joi.ValidationResult<any> => {
  const schema = Joi.object({
    content: Joi.string().min(3).max(1000).required().messages({
      "any.required": "Content is required.",
      "string.min": "Content must be at least 3 characters long.",
      "string.max": "Content cannot exceed 1000 characters.",
    }),
    blogId: Joi.string().required().messages({
      "any.required": "Blog ID is required.",
    }),
    name: Joi.string().min(2).max(100).required().trim().messages({
      "any.required": "Name is required.",
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name cannot exceed 100 characters.",
    }),
    email: Joi.string().email().required().trim().messages({
      "any.required": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),
  });

  return schema.validate(comment);
};

export { Comment, validateComment as validate, commentSchema };
