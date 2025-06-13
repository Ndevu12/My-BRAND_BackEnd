/**
 * This file deals with storing and handling Message information.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of a Message document.
 */
export interface IMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Class representing the Message model.
 */
        const messageSchema = new Schema<IMessage>({
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 100,
            },
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
            },
            subject: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 200,
            },
            message: {
                type: String,
                required: true,
                trim: true,
                minlength: 10,
                maxlength: 2000,
            },
            isRead: {
                type: Boolean,
                default: false,
            },
        }, { timestamps: true });

        const Message = mongoose.model<IMessage>('Message', messageSchema);

export { Message};
