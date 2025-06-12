import { Comment, IComment } from "../models/comments";

class CommentServices {
  
      // Method to create a new comment
      static async createComment(data: IComment | any): Promise<IComment> {
        const comment = await (await Comment.create(data)).save();
        return comment;
    }

    // Method to find a comment by ID
    static findCommentById(id: string): Promise<IComment | null> {
        const comment = Comment.findById(id);
        return comment;
    }    static findCommentByBlogId(id: string): Promise<IComment[] | null> {
        const comments = Comment.find({blogId: id}).sort({ createdAt: -1 });
        return comments;
    }


    // Method to update a comment
    static updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
        const comment = Comment.findByIdAndUpdate(id, data, { new: true }).exec();
        return comment;
    }

    // Method to delete a comment by ID
    static deleteComment(id: string): Promise<IComment | null> {
        const comment = Comment.findByIdAndDelete(id).exec();
        return comment;
    }

    static getAllComments(): Promise<IComment[] | null> {
        const comment = Comment.find().exec();
        return comment;
    }

    static async deletemany(): Promise<any> {
        const comment = await Comment.deleteMany({}).exec();
        return comment;
     }
}

export default CommentServices;
