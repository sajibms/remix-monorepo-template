import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

import Loading from "~/components/shared/Loading";
import {
  createContactUs,
  getOtherSettings,
} from "~/models/other-settings/other-settings.service";

export const loader = async () => {
  const settingInfo = await getOtherSettings();
  return json({ settingInfo });
};

export const OtherSettings = () => {
  const { settingInfo } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();
  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.success) {
      if (!toast.isActive("success-os-toast")) {
        toast.success(data?.message || "Operation Successfully", {
          toastId: "success-os-toast",
        });
      }
    } else if (data?.error) {
      if (!toast.isActive("error-os-toast")) {
        toast.error(data?.error || "Something went wrong", {
          toastId: "error-os-toast",
        });
      }
    }
  }, [data]);

  return (
    <section className="body-font w-full p-5">
      <Form method="post" className="space-y-6">
        <div className="space-y-6">
          <section className={`w-full space-y-4 md:w-2/3`}>
            <h3 className={sectionHeadingClass}>Contact us Information</h3>
            {/* Google Analytics */}
            <div className="mb-4">
              <label
                htmlFor="contactusTitle"
                className="mb-2 block font-medium"
              >
                Page Title
              </label>
              <input
                type="text"
                id="contactusTitle"
                name="contactusTitle"
                defaultValue={settingInfo?.contactus?.contactusTitle}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="contactusDescription"
                className="mb-2 block font-medium"
              >
                Description
              </label>
              <textarea
                id="contactusDescription"
                name="contactusDescription"
                defaultValue={settingInfo?.contactus?.contactusDescription}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactEmail" className="mb-2 block font-medium">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                defaultValue={settingInfo?.contactus?.contactEmail}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

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
          </section>
        </div>
      </Form>
    </section>
  );
};

export default OtherSettings;

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const result = await createContactUs(data);
  return json({
    success: true,
    data: result,
  });
};

const sectionHeadingClass =
  "text-gray-500 text-lg px-4 py-3 border-l-4 border-l-blue-500";