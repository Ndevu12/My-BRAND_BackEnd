/**
 * This file handles the Author collection.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of an author document.
 */
export interface IAuthor extends Document {
    name: string;
    postId?: string[];
    createdAt: Date;
}

/**
 * Class representing the Author model.
 */
        const authorSchema = new Schema<IAuthor>({
            name: {
                type: String,
                required: true,
            },
            postId: {
                type: [Schema.Types.ObjectId],
                ref: 'Blog',
                required: true,
                unique: true,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true,
            },
        });

        const  Author = mongoose.model<IAuthor>('Author', authorSchema);

export { Author};
