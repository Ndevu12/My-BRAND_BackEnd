import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of an admin document.
 */
export interface IUser extends Document {
    username: string;
    password: any;
    email: string;
    phoneNumber: string;
    fullName: string;
    profileImage?: string;
    role: string;
}

// Define the schema for the Admin collection
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user', 
    },
});

userSchema.methods.deletemany = function (): Promise<void | any> {
    return this.deleteMany().exec();
};

const User = mongoose.model<IUser>('User', userSchema);

export { User };
