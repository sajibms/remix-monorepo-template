import { Model } from "mongoose";

export interface IPostSetting {
  _id?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  thumbnail: string;
  views: number;
  altText: string;
  content: string;
  status?: string;
}

export type PostSettingModel = Model<IPostSetting>;
