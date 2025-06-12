import { type Request, type Response } from "express";
import { Blog } from "../models/Blog";
import { Comment, validate } from "../models/comments";
import mongoose from "mongoose";
import response from "../helpers/response";

class CommentController {  static async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { error } = validate(req.body);
      if (error !== undefined) {
        response(res, 400, "Validation error: " + error?.details[0].message, null, "VALIDATION_ERROR");
        return;
      }

      const existingBlog = await Blog.findById(req.body.blogId);
      if (existingBlog == null) {
        response(res, 404, "Invalid blog ID", null, "BLOG_NOT_FOUND");
        return;
      }
      
      const comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
        blogId: req.body.blogId,
      });

      await comment.save();
      
      // Add comment reference to blog
      existingBlog.comments!.push(comment._id as mongoose.Types.ObjectId);
      await existingBlog.save();

      response(res, 201, "Comment posted successfully", comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }
  static async deleteComments(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response(res, 400, "Invalid ID", null, "INVALID_ID");
        return;
      }
      
      const comment = await Comment.findByIdAndDelete(id);

      if (comment == null) {
        response(res, 404, "Comment with the given ID was not found", null, "COMMENT_NOT_FOUND");
        return;
      }

      // Remove comment reference from blog
      await Blog.findByIdAndUpdate(comment.blogId, {
        $pull: { comments: comment._id }
      });

      response(res, 200, "Comment deleted successfully", null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      response(res, 500, "An unexpected error occurred", null, "SERVER_ERROR");
    }
  }

  /**
   * Get all comments for a specific blog
   */
  static async getCommentsByBlogId(req: Request, res: Response): Promise<void> {
    try {
      const { blogId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        response(res, 400, "Invalid blog ID", null, "INVALID_BLOG_ID");
        return;
      }

      const comments = await Comment.find({ blogId })
        .sort({ createdAt: -1 }) // Most recent first
        .select('-email'); // Don't expose email addresses in public API

      response(res, 200, "Comments retrieved successfully", comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      response(res, 500, "An unexpected error occurred", null, "SERVER_ERROR");
    }
  }

  /**
   * Update a comment (for moderation purposes)
   */
  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        response(res, 400, "Invalid comment ID", null, "INVALID_ID");
        return;
      }

      if (!content || content.trim().length < 3) {
        response(res, 400, "Content is required and must be at least 3 characters", null, "VALIDATION_ERROR");
        return;
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content: content.trim() },
        { new: true }
      );

      if (!updatedComment) {
        response(res, 404, "Comment not found", null, "COMMENT_NOT_FOUND");
        return;
      }

      response(res, 200, "Comment updated successfully", updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      response(res, 500, "An unexpected error occurred", null, "SERVER_ERROR");
    }
  }
}

export default CommentController;
