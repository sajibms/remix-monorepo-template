import mongoose, { model, Schema } from 'mongoose';

import { IPostSetting } from '@acme/types';

const PostSettingSchema = new Schema<IPostSetting>(
  {
    title: {
      type: String,
      required: [true, 'title Is required'],
      trim: true,
    },
    metaTitle: {
      type: String,
      required: [true, 'metaTitle Is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'thumbnail Is required'],
      trim: true,
    },
    metaDescription: {
      type: String,
      required: [true, 'metaDescription Is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'slug Is required'],
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    altText: {
      type: String,
      required: [true, 'altText Is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'content Is required'],
      trim: true,
    },
    status: {
      type: String,
      default: 'draft',
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const PostSetting =
  mongoose.models['Post-Setting'] ||
  model<IPostSetting>('Post-Setting', PostSettingSchema);
