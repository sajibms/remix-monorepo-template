import mongoose, { model, Schema } from "mongoose";

import {
  GeneralSettingModel,
  IGeneralSetting,
} from "./generalSetting.interface";

const GeneralSettingSchema = new Schema<IGeneralSetting, GeneralSettingModel>(
  {
    title: {
      type: String,
      required: [true, "title Is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description Is required"],
    },
    siteUrl: {
      type: String,
      required: [true, "url Is required"],
    },
    logo: {
      type: String,
      required: [true, "Logo Is required"],
      trim: true,
    },
    favicon: {
      type: String,
      required: [true, "Favicon Is required"],
      trim: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const GeneralSetting = mongoose.models["General-Setting"] || model<IGeneralSetting, GeneralSettingModel>(
  "General-Setting",
  GeneralSettingSchema,
);
