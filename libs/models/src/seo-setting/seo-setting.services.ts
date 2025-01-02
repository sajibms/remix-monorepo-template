import { getAllCustomPages } from "../custom-page/custom-page.service";
import { GeneralSetting } from "../generalSettings/generalSetting.model";
import { getGeneralSetting } from "../generalSettings/generalSetting.services";

import { ISEOSetting } from "./seo-setting.interface";
import { SEOSettingModel } from "./seo-setting.model";

export const createSEOSetting = async (
  payload: ISEOSetting,
): Promise<ISEOSetting> => {
  const findModelData = await SEOSettingModel.findOne({});

  if (findModelData) {
    await SEOSettingModel.updateOne({}, payload);
    return await SEOSettingModel.findOne({}) as ISEOSetting;
  } else {
    const seoSetting = await SEOSettingModel.create(payload);
    return seoSetting;
  }
};
export const getSEOSetting = async (): Promise<ISEOSetting[]> => {
  const seoSetting = await SEOSettingModel.find();
  return seoSetting;
};
export const getMetaInfo = async () => {
  const [seoSetting, generalSetting] = await Promise.all([
    getSEOSetting(),
    getGeneralSetting(),
  ]);
  return { seoSetting, generalSetting };
};

export const getRobotsInfo = async () => {
  const generalSetting = await GeneralSetting.find({});

  return generalSetting;
};

export const getAllSitemap = async () => {
  try {
    const [customPages, robotsInfo] = await Promise.all([
      getAllCustomPages(),
      getRobotsInfo(),
    ]);
    return {
      customPages,
      robotsInfo,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw error to handle it further up the call chain if necessary
  }
};