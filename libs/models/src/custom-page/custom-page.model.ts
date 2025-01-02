import mongoose, { model, Schema } from "mongoose";

import {
  IBannerSection,
  ICustomPage,
  IFAQItem,
  IStep,
  IStepsSection,
} from "./custom-page.interface";

const BannerSchema = new Schema<IBannerSection>(
  {
    bannerTitle: {
      type: String,
      required: [true, "Banner Title is required"],
    },
    bannerSubtitle: {
      type: String,
      required: [true, "Banner Subtitle is required"],
    },
    buttonText: {
      type: String,
      required: [true, "Button Text is required"],
    },
  },
  {
    _id: false,
  },
);

const StepSchema = new Schema<IStep>(
  {
    step: {
      type: Number,
      required: [true, "Step is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
    },
  },
  {
    _id: false,
  },
);

const StepsSectionSchema = new Schema<IStepsSection>(
  {
    stepsSectionTitle: {
      type: String,
      required: [true, "Steps Section Title is required"],
    },
    steps: [StepSchema],
  },
  {
    _id: false,
  },
);

const FAQSchema = new Schema<IFAQItem>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const CustomPageSchema = new Schema<ICustomPage>(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
    },
    schemaMarkUp: { type: String },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    bannerSection: BannerSchema,
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "draft",
    },
    stepsSection: StepsSectionSchema,
    faqSection: [FAQSchema],
  },
  {
    timestamps: true,
  },
);

export const CustomPage = mongoose.models["Custom-Page"] || model<ICustomPage>("Custom-Page", CustomPageSchema);
