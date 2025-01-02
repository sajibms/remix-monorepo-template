import mongoose, { model, Schema } from "mongoose";

import { IUser, UserModel } from "./auth.interface";

const userSchema = new Schema<IUser, UserModel>(
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

export const User = mongoose.models["User"] || model<IUser, UserModel>("User", userSchema);
