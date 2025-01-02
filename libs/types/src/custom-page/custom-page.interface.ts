export interface IBannerSection {
  bannerTitle: string;
  bannerSubtitle: string;
  buttonText: string;
}

export interface IStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface IStepsSection {
  stepsSectionTitle: string;
  steps: IStep[];
}

export interface IFAQItem {
  question: string;
  answer: string;
}

export interface ICustomPage {
  slug: string;
  content: string;
  views?: number;
  status?: string;
  bannerSection: IBannerSection;
  stepsSection: IStepsSection;
  faqSection: IFAQItem[];
  createdAt?: Date;
  updatedAt?: Date;
  schemaMarkUp?: string;
}

export interface ICustomPageResponse extends ICustomPage {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
