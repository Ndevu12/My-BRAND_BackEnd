import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing a user profile document in the database
 */
export interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId; // Reference to the parent User
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for the UserProfile model
 */
const userProfileSchema = new Schema<IUserProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },    avatarUrl: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

/**
 * UserProfile model
 */
const UserProfile = mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

export { UserProfile };
