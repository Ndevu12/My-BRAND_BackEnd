/**
 * This file deals with storing and handling Message information.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of a Message document.
 */
export interface IMessage extends Document {
    email: string;
    message: string;
    sendAt: Date;
    notifyMe: boolean;
    avatarOrImage: string;
}

/**
 * Class representing the Message model.
 */
        const messageSchema = new Schema<IMessage>({
            email: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            sendAt: {
                type: Date,
                default: Date.now(),
                required: true,
            },
            notifyMe: {
                type: Boolean,
                required: false,
            },
            avatarOrImage: {
                type: String,
                required: false,
            },
        });

        const Message = mongoose.model<IMessage>('Message', messageSchema);

export { Message};
