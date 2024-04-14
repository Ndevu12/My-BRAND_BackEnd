/**
 * Controller for handling Comment-related operations.
 */
import { Request, Response } from 'express';
import { IComment } from '../models/comments.ts';
import Comment from '../services/commentService.ts';

class commentController {
    /**
     * Method to create a new comment.
     * @param req Request object containing comment data.
     * @param res Response object to send the result.
     */
   static async createComment(req: Request, res: Response): Promise<void> {
        try {
            const commentData: Partial<IComment> = req.body;
            const newComment = await Comment.createComment(commentData);
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Method to retrieve all comments.
     * @param req Request object.
     * @param res Response object to send the comments.
     */
   static async getAllComments(req: Request, res: Response): Promise<void> {
        try {
            const comments = await Comment.getAllComments();
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    /**
     * Method to retrieve a comment by its ID.
     * @param req Request object containing the comment ID.
     * @param res Response object to send the comment.
     */
   static async getCommentById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const comment = await Comment.findCommentById(id);
            if (comment) {
                res.status(200).json(comment);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } catch (error) {
            console.error('Error fetching comment by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
       /**
     * Method to retrieve a comment by post ID.
     * @param req Request object containing the comment ID.
     * @param res Response object to send the comment.
     */
   static async findCommentByPostID(req: Request, res: Response): Promise<void>{
        try{
            const {post_ID} = req.params;
            const comment = await Comment.findCommentByPostID(post_ID);
            if(comment){
                res.status(200).json(comment);
            }else{
                res.status(404).json({error: 'comment not found'});
            }      
        }catch (error) {
            console.error('Error fetching comment by post ID:', error);
            res.status(500).json({error: 'Internal server Error'});
        }
    }

    /**
     * Method to update a comment by its ID.
     * @param req Request object containing the comment ID and updated data.
     * @param res Response object to send the updated comment.
     */
   static async updateComment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedCommentData = req.body;
            const updatedComment = await Comment.updateComment(id, updatedCommentData);
            if (updatedComment) {
                res.status(200).json(updatedComment);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Method to delete a comment by its ID.
     * @param req Request object containing the comment ID.
     * @param res Response object to send the result.
     */
   static async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedComment = await Comment.deleteComment(id);
            if (deletedComment) {
                res.status(200).json({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default commentController;
