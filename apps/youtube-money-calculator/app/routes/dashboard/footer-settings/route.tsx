import {
  json,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "~/components/shared/Loading";
import { IFooterSection } from "~/models/footer-section/footer.interface";
import {
  createFooterSection,
  getFooterSection,
} from "~/models/footer-section/footer.service";

export const loader = async () => {
  const footerSectionValue = await getFooterSection();
  return json({ footerSectionValue });
};

//*
export default function FooterSetting() {
  const { footerSectionValue } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();
  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.success) {
      if (!toast.isActive("success-footer-toast")) {
        toast.success(data?.message || "Operation Successfully", {
          toastId: "success-footer-toast",
        });
      }
    } else if (data?.error) {
      if (!toast.isActive("error-footer-toast")) {
        toast.error(data?.error || "Something went wrong", {
          toastId: "error-footer-toast",
        });
      }
    }
  }, [data]);

  return (
    <div className="w-full p-10">

      <section className={`w-full my-4  md:w-2/3`}>
        <h3 className={sectionHeadingClass}>Legal Pages</h3>

        <div className="flex gap-4 mt-4">
          <Link
            to="/admin/dashboard/important-pages/edit?slug=about-us"
            className="rounded-lg bg-[#6366F1] px-4 py-2 text-white"
          >
            About Us
          </Link>
          <Link
            to="/admin/dashboard/important-pages/edit?slug=privacy-policy"
            className="rounded-lg bg-[#6366F1] px-4 py-2 text-white"
          >
            Privary Policy
          </Link>
          <Link
            to="/admin/dashboard/important-pages/edit?slug=terms-and-conditions"
            className="rounded-lg bg-[#6366F1] px-4 py-2 text-white"
          >
            Terms and Conditions
          </Link>
        </div>

      </section>

      <Form
        className="w-full space-y-6"
        method="post"
        encType="multipart/form-data"
      >
        {/* Legal & Contact Info */}
        <section className={`w-full space-y-4 md:w-2/3`}>
          <h3 className={sectionHeadingClass}>Legal & Contact Info</h3>

          {/* Copyright */}
          <div>
            <label htmlFor="copyright" className={labelClass}>
              Copyright
            </label>
            <input
              id="copyright"
              name="copyright"
              className={InputClass}
              type="text"
              placeholder="Add copyright information, e.g., © Your Company"
              defaultValue={
                footerSectionValue[0]?.legalAndContactInfo.copyright
              }
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              name="address"
              className={InputClass}
              type="text"
              placeholder="Add address information, e.g., 123 Main St, Anytown, USA"
              defaultValue={footerSectionValue[0]?.legalAndContactInfo.address}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              className={InputClass}
              type="number"
              placeholder="+1234567890"
              defaultValue={footerSectionValue[0]?.legalAndContactInfo.phoneNumber}
            />
          </div>
        </section>

        {/* Footer Section */}
        {["01", "02", "03"].map((socialMedia) => {
          return (
            <section key={socialMedia} className={`w-full space-y-4 md:w-2/3`}>
              {/* Section Heading */}
              <h3 className={sectionHeadingClass}>
                Social Media {socialMedia}
              </h3>


              {/* icon name */}
              <div>
                <label
                  htmlFor={`socialMedia${socialMedia}Name`}
                  className={labelClass}
                >
                  Icon Name
                </label>
                <input
                  id={`socialMedia${socialMedia}Name`}
                  name={`socialMedia${socialMedia}Name`}
                  className={InputClass}
                  type="text"
                  required
                  placeholder={`Enter icon name for logo`}
                  defaultValue={
                    footerSectionValue[0]?.socialMedias?.[socialMedia - 1].name
                  }
                />
              </div>

              {/* Image Field & Preview */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex-1">
                  <label
                    htmlFor={`socialMedia${socialMedia}image`}
                    className={labelClass}
                  >
                    Icon
                  </label>
                  <textarea className={InputClass} defaultValue={footerSectionValue[0]?.socialMedias?.[socialMedia - 1]?.image} name={`socialMedia${socialMedia}image`} id={`socialMedia${socialMedia}image`}></textarea>
                </div>
              </div>

              {/* social media link */}
              <div>
                <label
                  htmlFor={`socialMedia${socialMedia}Link`}
                  className={labelClass}
                >
                  Link
                </label>
                <input
                  id={`socialMedia${socialMedia}Link`}
                  name={`socialMedia${socialMedia}Link`}
                  className={InputClass}
                  type="text"
                  placeholder={`link`}
                  defaultValue={
                    footerSectionValue[0]?.socialMedias?.[socialMedia - 1]?.link
                  }
                />
              </div>

            </section>
          );
        })}

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
  );
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const payload: IFooterSection = {
    legalAndContactInfo: {
      copyright: formData.get("copyright") as string,
      address: formData.get("address") as string,
      phoneNumber: parseInt(formData.get("phoneNumber") as string, 10)
    },
    socialMedias: [
      {
        socialMedia: "01",
        link: formData.get("socialMedia01Link") as string,
        image:
          (formData.get("socialMedia01image") as string) ||
          "",
        name: formData.get("socialMedia01Name") as string,
      },
      {
        socialMedia: "02",
        link: formData.get("socialMedia02Link") as string,
        image:
          (formData.get("socialMedia02image") as string) ||
          "",
        name: formData.get("socialMedia02Name") as string,
      },
      {
        socialMedia: "03",
        link: formData.get("socialMedia03Link") as string,
        image:
          (formData.get("socialMedia03image") as string) ||
          "",
        name: formData.get("socialMedia03Name") as string,
      },
    ],
  };

  await createFooterSection(payload);
  return json({
    success: true,
    message: "Created Footer Section successfully",
  });
};

// css classes for inputfields and sections
const sectionHeadingClass =
  "text-gray-500 text-lg px-4 py-3 border-l-4 border-l-blue-500";

const labelClass = "block font-medium mb-2";

const InputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
