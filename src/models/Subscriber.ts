import mongoose, { Schema, Document } from 'mongoose';

/**
 *  Define the interface for the Subscriber document
 */
export interface ISubscriber extends Document {
    full_name: string;
    email: string;
    location: string;
    preference: string;
    subscribe_at: Date;
    likedBlogs?: string[];
}

/**
 *  Define the Subscriber schema using a class
 */
       const SubscriberSchema = new  Schema<ISubscriber>({
            full_name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            location: {
                type: String,
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
                ref: "blog", 
                required: true,
                default: [],
            }
        });

const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export { Subscriber};
