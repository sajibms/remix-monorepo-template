import { IUser } from '@acme/types';
import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username Is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password Is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const User = mongoose.models["User"] || model<IUser>("User", userSchema);
