import { Model } from "mongoose";

export interface IGeneralSetting {
  _id?: string;
  title: string;
  description: string;
  siteUrl: string;
  logo: string;
  favicon: string;
}

export type GeneralSettingModel = Model<IGeneralSetting>;
