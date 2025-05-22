import { type Request, type Response } from "express";
import { Blog } from "../models/Blog";
import { Comment, validate } from "../models/comments";
import mongoose from "mongoose";
import response from "../helpers/response";

class CommentController {  static async createComment(req: Request, res: Response): Promise<void>  {
    try {      const { error } = validate(req.body);
      if (error !== undefined) {
        response(res, 400, "Validation error: " + error?.details[0].message, null, "VALIDATION_ERROR");
        return;
      }

      const existingBlog = await Blog.findById(req.body.postID);
      if (existingBlog == null) {
        response(res, 404, "Invalid blog ID", null, "BLOG_NOT_FOUND");
        return;
      }
      
      const comment = new Comment({
        commenterName: req.body.commenterName,
        comment: req.body.comment,
        postID: req.body.postID,
      });

      await comment.save();

      response(res, 201, "Comment posted successfully", comment);    } catch (error) {
      response(res, 500, "Sorry, something went wrong", null, "SERVER_ERROR");
    }
  }

  static async deleteComments(req: Request, res: Response): Promise<void>  {
    try {      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response(res, 400, "Invalid ID", null, "INVALID_ID");
        return;
      }
      
      const comment = await Comment.findByIdAndDelete(id);

      if (comment == null) {
        response(res, 404, "Comment with the given ID was not found", null, "COMMENT_NOT_FOUND");
        return;
      }

      response(res, 200, "Comment deleted successfully", null);
    } catch (error) {
      response(res, 500, "An unexpected error occurred", null, "SERVER_ERROR");
    }
  }
}

export default CommentController;
