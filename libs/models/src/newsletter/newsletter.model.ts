import mongoose, { model, Schema } from "mongoose";

import { INewsLetter } from "./newsletter.interface";

const NewsLetterSchema = new Schema<INewsLetter>(
  {
    email: {
      type: String,
      required: [true, "Email Is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const NewsLetter = mongoose.models["NewsLetter"] || model<INewsLetter>("NewsLetter", NewsLetterSchema);