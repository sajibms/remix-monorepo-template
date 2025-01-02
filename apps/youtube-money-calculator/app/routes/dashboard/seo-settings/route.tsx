/* eslint-disable @typescript-eslint/no-explicit-any */
import {
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
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

import Loading from "~/components/shared/Loading";
import { requireUserSession } from "~/models/auth/auth.services";
import {
  convertDataToBuffer,
  convertDataToString,
  generateFileURL,
  uploadFile,
} from "~/models/FileUploadhelper";
import {
  createSEOSetting,
  getSEOSetting,
} from "~/models/seo-setting/seo-setting.services";
import { FormFields, UploadedFile } from "~/server/interface/file";

export const action = async ({ request }: { request: Request }) => {
  try {
    const uploadedFiles: Record<string, UploadedFile> = {};
    const formFields: FormFields = {};

    //* Handler function
    const uploadHandler = async ({
      name,
      data,
      filename,
      // mimetype,
    }: UploadHandlerPart) => {
      if (name === "openGraphImage" && data && filename) {
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
      uploadHandler,
    );

    const openGraphDescription = formData.get("openGraphDescription");
    const openGraphTitle = formData.get("openGraphTitle");
    const openGraphURL = formData.get("openGraphURL");
    // const googleAnalytics = formData.get("googleAnalytics");
    // const googleTagManager = formData.get("googleTagManager");
    const titleSeparator = formData.get("titleSeparator");
    // const customTags = formData.get("customTags");
    // const headerTags = formData.get("headerTags");
    // sitemap = formData.get("sitemap"),
    const robotsTxt = formData.get("robotsTxt");
    const customTags = formData.get("custom-tags")
      ? JSON.parse(formData.get("custom-tags")?.toString() as string)
      : [];

    // Get existing general settings to preserve existing logo and favicon if not updated
    const existingSettings = await getSEOSetting();

    const payload = {
      // googleAnalytics,
      // googleTagManager,
      openGraphDescription,
      openGraphTitle,
      openGraphURL,
      titleSeparator,
      customTags,
      // headerTags,
      robotsTxt,
      // schemaMarkUp,
      openGraphImage:
        formData.get("openGraphImage") ||
        existingSettings[0]?.openGraphImage ||
        null,
    };

    const errors: { error?: string } = {};
    // validating data
    // google analytics

    // title separator
    const validateTitleSeparator = (separator: string) => {
      const regex = /^[^a-zA-Z0-9\s]{1,3}$/;
      return regex.test(separator);
    };

    if (!validateTitleSeparator(payload.titleSeparator as string)) {
      errors.titleSeparator = "Invalid Title Separator";
    }

    if (Object.keys(errors).length > 0) {
      return json({ errors });
    }
    //* store data into DB
    const result = await createSEOSetting(payload);

    return json({
      success: true,
      message: result?.message,
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
export const loader = async ({ request }: { request: Request }) => {
  await requireUserSession(request);
  const SEOSetting = await getSEOSetting();

  return json({ SEOSettingData: SEOSetting });
};
interface ITagsFiled {
  id: number;
  label: string;
  value: string;
}
const SEOSetting = () => {
  const { SEOSettingData: SEOSetting } = useLoaderData<typeof loader>();
  // const [tagFields, setTagsFiled] = useState<ITagsFiled[]>([]);
  const actionData = useActionData<typeof action>();
  const [tagFields, setTagsFiled] = useState<ITagsFiled[]>(
    SEOSetting[0] ? SEOSetting[0].customTags : [],
  );

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const navigation = useNavigation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // When opening the modal
  const openModal = () => {
    document.getElementById("my_modal_1").showModal();
    setIsModalOpen(true);
  };

  // When closing the modal
  const closeModal = () => {
    document.getElementById("my_modal_1").close();
    setIsModalOpen(false);
  };

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      if (!toast.isActive("success-cp-toast")) {
        toast.success(actionData?.message || "Updated successfully.", {
          toastId: "success-cp-toast",
        });
      }
    } else if (actionData?.error) {
      if (!toast.isActive("error-cp-toast")) {
        toast.error(actionData?.error || "Failed to update.", {
          toastId: "error-cp-toast",
        });
      }
    }
  }, [actionData]);

  const [openGraphImage, setOpenGraphImage] = useState<string | null>(null);

  const handleOpenGraphImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOpenGraphImage(reader.result as string); // Type assertion to string
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewTagsFiledHandler = () => {
    if (!value || !label) {
      return toast.error("Label or Value is a required field.", {
        toastId: "error-cp-toast",
      });
    }
    setTagsFiled([
      ...tagFields,
      {
        id: tagFields.length + 1,
        label: label,
        value: value,
      },
    ]);
    closeModal();
    setLabel("");
    setValue("");
  };

  const removeTagsFiledHandler = (id: number) => {
    const filterTags = tagFields.filter((filed) => filed.id !== id);
    setTagsFiled(filterTags);
  };

  const updateTagsFiledValue = (id: number, newValue: string) => {
    const updatedValue = tagFields.map((filed) =>
      filed.id == id ? { ...filed, value: newValue } : filed,
    );
    setTagsFiled(updatedValue);
  };

  const updateTagsFiledLevel = (id: number, newLabel: string) => {
    const updatedLabel = tagFields.map((filed) =>
      filed.id === id ? { ...filed, label: newLabel } : filed,
    );
    setTagsFiled(updatedLabel);
  };

  return (
    <section className="body-font w-full p-5">
      <button
        disabled={isSubmitting}
        onClick={() => openModal()}
        className="rounded-lg border border-transparent bg-[#6366F1] px-10 py-1 text-lg font-semibold text-white focus:bg-[#6366F1] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        Add Tags
      </button>
      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <input
            type="text"
            name="custom-tags"
            hidden
            value={JSON.stringify(tagFields)}
            id=""
          />
          {/* Custom Tags */}
          {tagFields?.map((field) => (
            <div key={field.id} className="mb-4">
              <input
                type="text"
                onChange={(event) =>
                  updateTagsFiledLevel(field.id, event?.target.value)
                }
                value={field.label}
                defaultValue={field.label}
                required
                className="pinter mb-2 block w-full cursor-pointer rounded-lg border-none bg-white text-base font-medium leading-8 outline-none transition-colors duration-200"
              />
              <div className="flex items-center justify-center gap-2">
                <textarea
                  value={field.value}
                  onChange={(event) =>
                    updateTagsFiledValue(field.id, event.target.value)
                  }
                  placeholder="Enter Value"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  onClick={() => removeTagsFiledHandler(field.id)}
                  className="text-red-500"
                >
                  <MdDelete size={30} />
                </button>
              </div>
            </div>
          ))}
          {/* Open Graph Image and Preview */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1">
              <label
                htmlFor="openGraphImage"
                className="mb-2 block font-medium"
              >
                Open Graph Image
              </label>
              <input
                type="file"
                id="openGraphImage"
                name="openGraphImage"
                onChange={handleOpenGraphImageChange}
                // required
                className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
              />
            </div>
            {openGraphImage ? (
              <img
                src={openGraphImage}
                alt="open Graph Preview"
                className="mt-1 h-20 w-28 rounded object-contain"
              />
            ) : null}
          </div>
          {/* Title Separator */}
          <div className="mb-4">
            <label htmlFor="titleSeparator" className="mb-2 block font-medium">
              Title Separator
            </label>
            <input
              type="text"
              id="titleSeparator"
              name="titleSeparator"
              defaultValue={SEOSetting[0]?.titleSeparator}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {actionData?.errors ? (
              <em className="text-red-500">
                {actionData.errors.titleSeparator}
              </em>
            ) : null}
          </div>

          {/* Open Graph URL */}
          <div className="mb-4">
            <label htmlFor="openGraphURL" className="mb-2 block font-medium">
              Open Graph URL
            </label>
            <input
              type="text"
              id="openGraphURL"
              name="openGraphURL"
              defaultValue={SEOSetting[0]?.openGraphURL}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Open Graph Title */}
          <div className="mb-4">
            <label htmlFor="openGraphTitle" className="mb-2 block font-medium">
              Open Graph Title
            </label>
            <input
              type="text"
              id="openGraphTitle"
              name="openGraphTitle"
              defaultValue={SEOSetting[0]?.openGraphTitle}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Open Graph Description */}
          <div className="mb-4">
            <label htmlFor="openGraphDescription" className="mb-2 block font-medium">
              Open Graph Description
            </label>
            <textarea
              // type="text"
              id="openGraphDescription"
              name="openGraphDescription"
              defaultValue={SEOSetting[0]?.openGraphDescription}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          {/* Custom Tags */}

          {/*  Robots.txt */}
          <div className="mb-4">
            <label htmlFor="robotsTxt" className="mb-2 block font-medium">
              Robots.txt
            </label>
            <textarea
              // type="text"
              id="robotsTxt"
              name="robotsTxt"
              defaultValue={SEOSetting[0]?.robotsTxt}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
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
        {/* <h4 className="text-center text-xl font-semibold text-[#6366F1]">
          {data?.message}
        </h4> */}
      </Form>

      {/* Model Component  */}

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          {/* <h3 className="text-lg font-bold">Hello!</h3> */}

          <div className="mb-4 mt-5">
            <label htmlFor="robotsTxt" className="mb-2 block font-medium">
              Label
            </label>
            <input
              value={label}
              // type="text"
              id="model-filed"
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="mb-4 mt-5">
            <label htmlFor="robotsTxt" className="mb-2 block font-medium">
              Value
            </label>
            <textarea
              // type="text"
              value={value}
              id="model-textarea"
              onChange={(e) => setValue(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex justify-center gap-4">
            <div>
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => closeModal()}
                className="rounded-lg border border-transparent bg-red-500 px-10 py-1 text-lg font-semibold text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            <div>
              {/* if there is a button in form, it will close the modal */}
              <button
                // type="submit"
                // disabled={isSubmitting}
                onClick={() => addNewTagsFiledHandler()}
                className="rounded-lg border border-transparent bg-[#6366F1] px-10 py-1 text-lg font-semibold text-white focus:bg-[#6366F1] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default SEOSetting;
