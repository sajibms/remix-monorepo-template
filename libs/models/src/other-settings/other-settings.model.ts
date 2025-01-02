import mongoose, { model, Schema } from 'mongoose';
import { IOtherSettings } from '@acme/types';

const contactUsSchema = new Schema(
  {
    contactusTitle: {
      type: String,
      required: true,
    },
    contactusDescription: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const otherSettingsSchema = new Schema<IOtherSettings>(
  {
    contactus: contactUsSchema,
  },
  {
    timestamps: true,
  }
);

export const OtherSettings =
  mongoose.models['other-settings'] ||
  model<IOtherSettings>('other-settings', otherSettingsSchema);
