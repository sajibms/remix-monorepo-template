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
  createGeneralSetting,
  getGeneralSetting,
} from "~/models/generalSettings/generalSetting.services";
import { FormFields, UploadedFile } from "~/server/interface/file";

export const action = async ({ request }: { request: Request }) => {
  try {
    const uploadedFiles: Record<string, UploadedFile> = {};
    const formFields: FormFields = {};
    const generalSetting = await getGeneralSetting();
    //* Handler function
    const uploadHandler = async ({
      name,
      data,
      filename,
    }: UploadHandlerPart) => {
      // Check if data exists before processing
      if ((name === "logo" || name === "favicon") && data && filename) {
        //* convert file buffer
        const bufferFile = await convertDataToBuffer(data);

        //* upload file into r2
        const result = await uploadFile(filename as string, bufferFile);
        if (!result) {
          throw new Error(`File upload failed for ${name}`);
        }
        //* generate and return file url
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

    //* get form data
    const title = formData.get("title");
    const description = formData.get("description");
    const siteUrl = generalSetting?.siteUrl ?? formData.get("siteUrl");

    // Get existing general settings to preserve existing logo and favicon if not updated
    const existingSettings = await getGeneralSetting();

    // Construct payload, using existing values if no new files are uploaded
    const payload = {
      title,
      description,
      siteUrl,
      logo: formData.get("logo") || existingSettings?.logo || null,
      favicon: formData.get("favicon") || existingSettings?.favicon || null,
    };

    //* store data in your DB
    const result = await createGeneralSetting(payload);

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
  const generalSetting = await getGeneralSetting();

  return json({ generalSettingData: generalSetting });
};

const GeneralSetting = () => {
  const { generalSettingData } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();

  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.success) {
      if (!toast.isActive("success-credential-toast")) {
        toast.success(data?.message || "Operation Successful", {
          toastId: "success-credential-toast",
        });
      }
    } else if (data?.error) {
      if (!toast.isActive("error-credential-toast")) {
        toast.error(data?.error || "Something went wrong", {
          toastId: "error-credential-toast",
        });
      }
    }
  }, [data]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string); // Type assertion to string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string); // Type assertion to string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="body-font w-full p-5">
      <div className="w-full md:w-2/3 lg:w-3/5">
        <Form method="post" encType="multipart/form-data" className="space-y-6">
          {/* Site URL */}
          <div className="mb-4">
            <label htmlFor="siteUrl" className="mb-2 block font-medium">
              Site URL
            </label>
            <input
              type="text"
              id="siteUrl"
              name="siteUrl"
              defaultValue={generalSettingData?.siteUrl}
              required
              disabled={generalSettingData?.siteUrl ? true : false}
              placeholder="Enter site URL"
              className={`${generalSettingData?.siteUrl ? "bg-gray-200" : ""} w-full rounded-lg border border-gray-300 px-3 py-2 text-base leading-8 text-gray-500 outline-none transition-colors duration-200 ease-in-out`}
            />
          </div>

          {/* Site Title */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block font-medium">
              Site Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={generalSettingData?.title}
              required
              placeholder="Enter site title"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Site Description */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block font-medium">
              Site Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              defaultValue={generalSettingData?.description}
              required
              placeholder="Enter site Description"
              className="w-full rounded-lg border border-gray-300  px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out"
            />
          </div>

          {/* Logo */}
          <div className="mb-4">
            <label htmlFor="logo" className="mb-2 block font-medium">
              Site Logo
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="logo"
                name="logo"
                required={!generalSettingData?.logo}
                onChange={handleLogoChange}
                className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
              />

              {logoPreview || generalSettingData?.logo ? (
                <img
                  src={logoPreview ?? generalSettingData?.logo}
                  alt="Logo Preview"
                  className="mt-1 h-20 w-28 rounded object-cover"
                />
              ) : null}
            </div>
          </div>

          {/* Favicon */}
          <div className="mb-4">
            <label htmlFor="favicon" className="mb-2 block font-medium">
              Favicon
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="favicon"
                name="favicon"
                onChange={handleFaviconChange}
                required={!generalSettingData?.favicon}
                className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
              />

              {faviconPreview || generalSettingData?.favicon ? (
                <img
                  src={faviconPreview ?? generalSettingData?.favicon}
                  alt="Favicon Preview"
                  className="mt-1 h-20 w-28 rounded object-cover"
                />
              ) : null}
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
        </Form>
      </div>
    </section>
  );
};

export default GeneralSetting;
