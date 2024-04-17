import mongoose, { Schema, Document } from 'mongoose';

/**
 *  Define the interface for the Subscriber document
 */
export interface ISubscriber extends Document {
    username: string;
    email: string;
    location: string;
    role: string;
    preference: string;
    subscribe_at: Date;
    likedBlogs?: string[];
}

/**
 *  Define the Subscriber schema using a class
 */
       const SubscriberSchema = new  Schema<ISubscriber>({
            username: {
                type: String,
                required: false,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            location: {
                type: String,
                required: false,
            },
            role: {
                type: String,
                enum: ['subscriber'], 
                default: 'subscriber',
                required: true,
            },
            preference: {
                type: String,
                required: false,
            },
            subscribe_at: {
                type: Date,
                default: Date.now,
            },

            likedBlogs: {
                type: [Schema.Types.ObjectId], 
                ref: "Blog", 
                required: false,
                default: [],
            }
        });

const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export { Subscriber};
