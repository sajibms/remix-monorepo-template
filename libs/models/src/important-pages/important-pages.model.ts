import mongoose, { model, Schema } from "mongoose";

import { IImportantPages } from "./important-pages.interface";

const importantPageSchema = new Schema<IImportantPages>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const ImportantPageModel = mongoose.models["Important-pages"] || model("Important-pages", importantPageSchema);
