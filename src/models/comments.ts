/**
 * This file handles the Comments collection.
 */

import mongoose, { Schema, Document, model } from "mongoose";
import Joi from "joi";
/**
 * Interface representing the structure of a comment document.
 */
export interface IComment extends Document {
  postID: Schema.Types.ObjectId;
  commenterName: undefined;
  comment: string;
  createdAt?: Date;
}

/**
 * schema representing the Comment model.
 */

const commentSchema = new Schema<IComment>({
  postID: {
    type: [Schema.Types.ObjectId],
    ref: "Blog",
    required: true,
  },
  commenterName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model<IComment>("Comment", commentSchema);

const validateComment = (
  comment: Pick<IComment, "comment" | "postID">
): Joi.ValidationResult<any> => {
  const schema = Joi.object({
    comment: Joi.string().min(3).required().messages({
      "any.required": "content is required.",
    }),
    postID: Joi.string().required().messages({
      "any.required": "Blog is required.",
    }),
    commenterName: Joi.string().min(3).required().messages({
      "any.required": "Name is required.",
    }),
  });

  return schema.validate(comment);
};

export { Comment, validateComment as validate, commentSchema };
