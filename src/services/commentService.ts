import { Comment, IComment } from "../models/comments.ts";

class CommentServices {
  
      // Method to create a new comment
      static async createComment(data: Partial<IComment | any>): Promise<IComment> {
        console.log('Comment created at `${createdAt}`');
        return await (await Comment.create(data)).save();
    }

    // Method to find a comment by ID
    static findCommentById(id: string): Promise<IComment | null> {
        return Comment.findById(id).exec();
    }

    static findCommentByPostID(id: string): Promise<IComment | null> {
        return Comment.findById(id).exec();
    }


    // Method to update a comment
    static updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
        return Comment.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    // Method to delete a comment by ID
    static deleteComment(id: string): Promise<IComment | null> {
        return Comment.findByIdAndDelete(id).exec();
    }

    static getAllComments(): Promise<IComment[]> {
        return Comment.find().exec();
    }

    static async deletemany(): Promise<any> {
        return await Comment.deleteMany({}).exec();
     }
}

export default CommentServices;
