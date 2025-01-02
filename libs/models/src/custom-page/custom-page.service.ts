import { ICustomPage } from "./custom-page.interface";
import { CustomPage } from "./custom-page.model";

export const createCustomPage = async (payload: ICustomPage) => {
  // find existing slug
  const existingSlug = await CustomPage.findOne({ slug: payload.slug });
  if (existingSlug) {
    throw new Error("Slug already exists");
  }
  const result = await CustomPage.create(payload);
  return result;
};

export const getAllCustomPages = async () => {
  const result = await CustomPage.find({ slug: { $ne: "home" } });

  return result;
};

export const getHomePage = async () => {
  const result = await CustomPage.findOne({ slug: "home" });

  return result;
};

export const getACustomPage = async (slug: string) => {
  const result = await CustomPage.findOne({ slug });
  return result;
};

export const getACustomPageBasedOnSlug = async (slug: string) => {
  const updatePage = await CustomPage.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true },
  );

  if (updatePage && updatePage.status === "draft") {
    return new Error("Page Is Not Published");
  }

  return updatePage;
};

export const updateCustomPage = async (slug: string, payload: ICustomPage) => {
  try {
    const result = await CustomPage.findOneAndUpdate(
      { slug },
      { ...payload },
      {
        new: true,
      },
    );
    return result;
  } catch (error) {
    console.error("error", error);
    throw new Error(error as string);
  }
};

export const toggleCustomPageStatus = async (slug: string) => {
  try {
    const customPage = await CustomPage.findOne({ slug });
    if (!customPage) throw new Error("Custom page not found");

    const updatedStatus = customPage.status === "draft" ? "published" : "draft";
    return await CustomPage.findOneAndUpdate(
      { slug },
      { status: updatedStatus },
      { new: true },
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const deleteCustomPage = async (slug: string) => {
  try {
    const result = await CustomPage.findOneAndDelete({ slug });
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
};
