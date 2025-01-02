import mongoose, { model, Schema } from 'mongoose';

import { ISEOSetting } from '@acme/types';

const userSchema = new Schema<ISEOSetting>(
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
  }
);

export const SEOSettingModel =
  mongoose.models['SEO-Setting'] ||
  model<ISEOSetting>('SEO-Setting', userSchema);
