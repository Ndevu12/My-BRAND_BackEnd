/**
 * This file handles the Comments collection.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Interface representing the structure of a comment document.
 */
export interface IComment extends Document {
    postID: any; 
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

      const  Comment = mongoose.model<IComment>('Comment', commentSchema);


export {  Comment };
