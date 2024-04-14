/**
 * This file deals with storing and handling Notification information.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of a Notification document.
 */
export interface INotification extends Document {
    title: string;
    description: string;
    sendAt: Date;
}

/**
 * Class representing the Notification model.
 */
        const notificationSchema = new Schema<INotification>({
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            sendAt: {
                type: Date,
                default: Date.now(),
                required: true,
            },
        });

        const Notification = mongoose.model<INotification>('Notification', notificationSchema);
  

export{ Notification };
