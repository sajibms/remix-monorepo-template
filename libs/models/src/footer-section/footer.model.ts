import mongoose, { model, Schema } from 'mongoose';

import { IFooterSection } from '@acme/types';

const FooterSectionModel = new Schema<IFooterSection>(
  {
    legalAndContactInfo: {
      copyright: { type: String, required: true },
      address: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
    },
    socialMedias: [
      {
        socialMedia: { type: String, required: true },
        link: { type: String, required: true },
        image: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const FooterSection =
  mongoose.models['Footer-Section'] ||
  model<IFooterSection>('Footer-Section', FooterSectionModel);
