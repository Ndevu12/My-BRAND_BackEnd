import { type Request, type Response } from "express";
import { Blog } from "../models/Blog";
import { Comment, validate } from "../models/comments";
import mongoose from "mongoose";

class CommentController {
  static async createComment(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    try {
      const { error } = validate(req.body);
      if (error !== undefined) {
        return res
          .status(400)
          .json({ statuCode: 400, error: error?.details[0].message });
      }

      const existingBlog = await Blog.findById(req.body.postID);
      if (existingBlog == null) {
        return res
          .status(404)
          .json({ statuCode: 404, error: "Invalid blog ID" });
      }
      const comment = new Comment({
        commenterName: req.body.commenterName,
        comment: req.body.comment,
        postID: req.body.postID,
      });

      await comment.save();

      res.status(201).json({
        statuCode: 201,
        message: "comment posted successfully",
        comment,
      });
    } catch (error) {
      res
        .status(500)
        .json({ statuCode: 500, error: "Sorry, sommething went wrong" });
    }
  }

  static async deleteComments(
    req: Request,
    res: Response
  ): Promise<undefined | Response<any, Record<string, any>>> {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ error: "Invalid id" });
      return;
    }
    const comment = await Comment.findByIdAndDelete(id);

    if (comment == null) {
      return res.status(404).json({
        statuCode: 404,
        error: "comment with the given ID was not found.",
      });
    }

    res
      .status(200)
      .json({ statuCode: 200, message: "comment deleted successfully" });
  }
}

export default CommentController;
