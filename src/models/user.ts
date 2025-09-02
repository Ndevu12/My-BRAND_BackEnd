import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing the safe user data (without password)
 */
export interface ISafeUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface representing a user document in the database
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(): ISafeUser;
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
    }
  },
  { timestamps: true }
);

// Add a method to exclude sensitive data
userSchema.methods.toSafeObject = function(): ISafeUser {
  const userObject = this.toObject();
  delete userObject.password;
  return {
    _id: userObject._id,
    username: userObject.username,
    email: userObject.email,
    role: userObject.role,
    verified: userObject.verified,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt
  };
};

// Alternative: Add a transform function to JSON serialization
userSchema.set('toJSON', {
  transform: function(doc, ret, opt) {
    const { password, ...safeRet } = ret;
    return safeRet;
  }
});

/**
 * User model
 */
const User = mongoose.model<IUser>("User", userSchema);

export { User };
