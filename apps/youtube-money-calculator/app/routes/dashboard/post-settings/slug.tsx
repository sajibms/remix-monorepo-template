import {
  ActionFunctionArgs,
  json,
  unstable_parseMultipartFormData,
  UploadHandlerPart,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "~/components/shared/Loading";
import MakeTipTapContent from "~/components/TipTap/MakeTipTapContent";
import {
  convertDataToBuffer,
  convertDataToString,
  generateFileURL,
  uploadFile,
} from "~/models/FileUploadhelper";
import {
  createPostSetting,
  getPostBySlug,
  updatePostBySlug,
} from "~/models/postSetting/postSetting.services";
import { FormFields, UploadedFile } from "~/server/interface/file";

export const loader = async ({
  params,
  request,
}: {
  params: { slug: string };
  request: Request;
}) => {
  // const navigate = useNavigate();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (params.slug === "create") {
    return json({ post: null });
  } else {
    const post = await getPostBySlug(slug);

    return json({ post });
  }
};

export const action = async ({
  params,
  request,
}: {
  request: Request;
  params: ActionFunctionArgs;
}) => {
  try {
    const uploadedFiles: Record<string, UploadedFile> = {};
    const formFields: FormFields = {};
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get("slug");

    //* Handler function
    const uploadHandler = async ({
      name,
      data,
      filename,
    }: // mimetype,
    UploadHandlerPart) => {
      if (name === "thumbnail" && data && filename) {
        //* convert file buffer
        const bufferFile = await convertDataToBuffer(data);

        //* upload file into r2
        const result = await uploadFile(filename as string, bufferFile);
        if (!result) {
          throw new Error(`File upload failed for ${name}`);
        }
        //* generate and retune file url
        return generateFileURL(uploadedFiles, filename as string, name);
      } else {
        //* convert buffer file to string
        return convertDataToString(data, name, formFields);
      }
    };

    // Parse the form data and handle the file upload
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    const existingSettings = await getPostBySlug(pageSlug);

    //* get from data
    const title = formData.get("title") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const slug = existingSettings?.slug ?? (formData.get("slug") as string);
    const thumbnail =
      (formData.get("thumbnail") as string) ||
      existingSettings?.thumbnail ||
      null;
    const altText = formData.get("altText") as string;
    const content = formData.get("content") as string;

    const payload = {
      title,
      metaTitle,
      metaDescription,
      slug,
      thumbnail,
      altText,
      content,
    };

    if (params.slug === "create") {
      const result = await createPostSetting(payload);

      return json({
        success: true,
        message: result?.message,
      });
    } else {
      const result = await updatePostBySlug(pageSlug as string, payload);

      return json({
        success: true,
        message: result?.message,
      });
    }
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

const PostSetting = () => {
  const { post } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();

  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.success) {
      if (!toast.isActive("success-post-toast")) {
        toast.success(data?.message || "Operation Successful", {
          toastId: "success-post-toast",
        });
      }
    } else if (data?.error) {
      if (!toast.isActive("error-post-toast")) {
        toast.error(data?.error || "Something went wrong", {
          toastId: "error-post-toast",
        });
      }
    }
  }, [data]);

  const [content, setContent] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string); // Type assertion to string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="body-font w-full p-5">
      <div className="w-full md:w-2/3 lg:w-3/5">
        <Form method="post" encType="multipart/form-data" className="space-y-6">
          {/* Site Title */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={post?.title}
              required
              placeholder="Enter Title"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          {/* Meta Title */}
          <div className="mb-4">
            <label htmlFor="metaTitle" className="mb-2 block font-medium">
              Meta Title
            </label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              defaultValue={post?.metaTitle}
              required
              placeholder="Enter Meta Title"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          {/* Meta Description */}
          <div className="mb-4">
            <label htmlFor="metaDescription" className="mb-2 block font-medium">
              Meta Description
            </label>
            <input
              type="text"
              id="metaDescription"
              name="metaDescription"
              defaultValue={post?.metaDescription}
              required
              placeholder="Enter Meta Description"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          {/* Meta Slug */}
          <div className="mb-4">
            <label htmlFor="slug" className="mb-2 block font-medium">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={post?.slug}
              disabled={!!post?.slug}
              required
              placeholder="Enter Slug URL"
              className={`${
                post?.slug ? "bg-gray-200" : ""
              } w-full rounded-lg border border-gray-300 px-3 py-2 text-base leading-8 text-gray-500 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200`}
            />
          </div>
          {/* Thumbnail */}
          <div className="mb-4">
            <label htmlFor="thumbnail" className="mb-2 block font-medium">
              Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                required={!post?.thumbnail}
                onChange={handleThumbnailChange}
                className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
              />

              {thumbnailPreview || post?.thumbnail ? (
                <img
                  src={thumbnailPreview ?? post?.thumbnail}
                  alt="Logo Preview"
                  className="mt-1 h-20 w-28 rounded object-cover"
                />
              ) : null}
            </div>
          </div>

          {/* altText */}
          <div className="mb-4">
            <label htmlFor="altText" className="mb-2 block font-medium">
              Alt Text
            </label>
            <input
              type="text"
              id="altText"
              name="altText"
              defaultValue={post?.altText}
              required
              placeholder="Enter Alt Text"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          {/* TextEditor  */}
          <div>
            <label htmlFor="content" className="mb-2 block font-medium">
              Content
            </label>

            <MakeTipTapContent
              content={content}
              setContent={setContent}
              defaultContent={post?.content}
            />
          </div>
          {/* Save Button */}
          {isSubmitting ? (
            <Loading />
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg border border-transparent bg-[#6366F1] px-10 py-2 text-lg font-semibold text-white focus:bg-[#6366F1] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Save
            </button>
          )}
        </Form>
      </div>
    </section>
  );
};

export default PostSetting;
