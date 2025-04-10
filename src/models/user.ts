import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing a user document in the database
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  verified?: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for the User model
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

/**
 * User model
 */
const User = mongoose.model<IUser>("User", userSchema);

export { User };
