import { IGeneralSetting } from "./generalSetting.interface";
import { GeneralSetting } from "./generalSetting.model";

export const createGeneralSetting = async (
  payload: Partial<IGeneralSetting>,
) => {
  const isExistingData = await GeneralSetting.findOne({});

  try {
    if (isExistingData) {
      await GeneralSetting.findByIdAndUpdate(isExistingData._id, payload, {
        new: true,
      });
      return { message: "General Setting update successfully!" };
    } else {
      await GeneralSetting.create(payload);
      return { message: "General Setting create successfully!" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Upload operation failed. Please try again later.");
  }
};

export const getGeneralSetting = async (): Promise<IGeneralSetting | null> => {
  const result = await GeneralSetting.findOne({});
  return result;
};
