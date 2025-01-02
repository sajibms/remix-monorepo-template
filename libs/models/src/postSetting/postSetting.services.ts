/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPostSetting } from "@acme/types";
import { PostSetting } from "./postSetting.model";

export const getPostBySlug = async (
  slug: any,
): Promise<IPostSetting | null> => {
  try {
    const post = await PostSetting.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } }, // * Increment views by 1 in each request
      { new: true } // * Return the updated document
    );
    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Get operation failed. Please try again later.");
  }
};

export const createPostSetting = async (
  payload: Partial<IPostSetting>,
): Promise<IPostSetting> => {
  try {
    const post = await PostSetting.create(payload);
    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Upload operation failed. Please try again later.");
  }
};

export const createPostSettingInBulk = async (
  payload: IPostSetting[],
): Promise<string> => {
  try {
    await PostSetting.insertMany(payload);
    return "CSV file has been uploaded successfully!";
  } catch (error) {
    console.error(error);
    throw new Error("Upload operation failed. Please try again later.");
  }
};

export const getAllPost = async (): Promise<IPostSetting[]> => {
  try {
    const post = await PostSetting.find({});
    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Upload operation failed. Please try again later.");
  }
};

export const getAllPublicPost = async (): Promise<IPostSetting[]> => {
  try {
    const post = await PostSetting.find({ status: "published" });
    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Upload operation failed. Please try again later.");
  }
};
export const updatePostBySlug = async (slug: string, payload: IPostSetting) => {
  try {
    const result = await PostSetting.findOneAndUpdate({ slug }, payload, {
      new: true,
    });
    return result;
  } catch (error) {
    console.error("error", error);
    throw new Error(error as string);
  }
};

export const togglePostStatus = async (slug: string) => {
  try {
    const post = await PostSetting.findOne({ slug });
    if (!post) throw new Error("Post not found");

    const updatedStatus = post.status === "draft" ? "published" : "draft";
    return await PostSetting.findOneAndUpdate(
      { slug },
      { status: updatedStatus },
      { new: true }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};