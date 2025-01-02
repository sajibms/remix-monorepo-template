import mongoose, { model, Schema } from "mongoose";

import { ISEOSetting, SeoSettingModel } from "./seo-setting.interface";

const userSchema = new Schema<ISEOSetting, SeoSettingModel>(
  {
    openGraphImage: { type: String },
    openGraphTitle: { type: String },
    openGraphDescription: { type: String },
    openGraphURL: { type: String },
    titleSeparator: { type: String, required: true },
    customTags: { type: Array, default: [] },
    robotsTxt: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const SEOSettingModel = mongoose.models["SEO-Setting"] || model<ISEOSetting, SeoSettingModel>(
  "SEO-Setting",
  userSchema,
);
