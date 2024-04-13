/**
 * This file handles the Comments collection.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Interface representing the structure of a comment document.
 */
export interface IComment extends Document {
    post_ID: any; 
    commenterName: undefined;
    comment: string;
    createdAt?: Date;
}

/**
 * Class representing the Comment model.
 */
class commentModel {
    private readonly model: mongoose.Model<IComment>;

    constructor() {
        const commentSchema = new Schema<IComment>({
            post_ID: {
                type: Schema.Types.ObjectId,
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

        this.model = mongoose.model<IComment>('Comment', commentSchema);
    }

    // Method to create a new comment
    public async createComment(data: Partial<IComment | any>): Promise<IComment> {
        console.log('Comment created at `${createdAt}`');
        return await (await this.model.create(data)).save();
    }

    // Method to find a comment by ID
    public findCommentById(id: string): Promise<IComment | null> {
        return this.model.findById(id).exec();
    }

    public findCommentByPostID(id: string): Promise<IComment | null> {
        return this.model.findById(id).exec();
    }


    // Method to update a comment
    public updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    // Method to delete a comment by ID
    public deleteComment(id: string): Promise<IComment | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    public getAllComments(): Promise<IComment[]> {
        return this.model.find().exec();
    }

    public async deletemany(): Promise<any> {
        return await this.model.deleteMany().exec();
     }

}

export { commentModel };
