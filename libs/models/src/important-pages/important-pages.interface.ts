import { Model } from "mongoose";

export interface IImportantPages {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ImportantPageModel = Model<IImportantPages>;
