import { Model } from "mongoose";

import { ICustomPage } from "../custom-page/custom-page.interface";

export interface ISEOSetting {
  _id?: string;

  openGraphImage?: string; // Storing file path or URL
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphURL?: string;
  titleSeparator: string;
  customTags?: object[];
  robotsTxt?: string;
}

// Interface for robots info
export interface IRobotsInfo {
  siteUrl: string;
  // Add other fields as needed
}

export interface ISitemapData {
  customPages: ICustomPage[];
  robotsInfo: IRobotsInfo;
}

export type SeoSettingModel = Model<ISEOSetting>;
