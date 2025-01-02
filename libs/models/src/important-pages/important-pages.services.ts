import { IImportantPages } from '@acme/types';
import { ImportantPageModel } from './important-pages.model';

export const createImportantPage = async (
  payload: IImportantPages
): Promise<IImportantPages> => {
  const findPage = await ImportantPageModel.findOne({ slug: payload.slug });

  if (findPage) {
    throw new Error('Page already exists');
  } else {
    const createPage = await ImportantPageModel.create(payload);
    return createPage;
  }
};

export const getAllImportantPages = async () => {
  const result = await ImportantPageModel.find({});

  return result;
};

export const getAllImportantPagesByTitle = async () => {
  const result = await ImportantPageModel.find(
    { slug: { $ne: 'about-us' } },
    { title: 1, slug: 1 }
  );
  return result;
};

export const getSingleImportantPage = async (slug: string) => {
  const getApageAndIncrementViews = await ImportantPageModel.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  );

  return getApageAndIncrementViews;
};

export const updateImportantPage = async (
  slug: string,
  payload: IImportantPages
) => {
  try {
    const result = await ImportantPageModel.findOneAndUpdate(
      { slug },
      { ...payload },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    console.error('error', error);
    throw new Error(error as string);
  }
};
