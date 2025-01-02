import mongoose, { model, Schema } from "mongoose";

import { IContactUsForm } from "./contact-us-form.interface";

const ContactUsFormSchema = new Schema<IContactUsForm>(
  { 
    name: {
      type: String,
      required: [true, "Name Is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message Is required"],
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

export const ContactUsForm = mongoose.models["Contact-Us-Message"] || model<IContactUsForm>("Contact-Us-Message", ContactUsFormSchema);
