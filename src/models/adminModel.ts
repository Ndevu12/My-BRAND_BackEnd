import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the structure of an admin document.
 */
export interface IAdmin extends Document {
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    role: string;
}

// Define the schema for the Admin collection
const adminSchema = new Schema<IAdmin>({
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
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user', 
    },
});

adminSchema.statics.deletemany = function (): Promise<void | any> {
    return this.deleteMany().exec();
};

//export the Admin model
const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);

export { AdminModel };
