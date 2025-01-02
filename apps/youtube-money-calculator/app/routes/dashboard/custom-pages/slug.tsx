import {
  Form,
  isRouteErrorResponse,
  json,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "~/components/shared/Loading";
import MakeTipTapContent from "~/components/TipTap/MakeTipTapContent";
import { ICustomPage } from "~/models/custom-page/custom-page.interface";
import {
  createCustomPage,
  getACustomPage,
  updateCustomPage,
} from "~/models/custom-page/custom-page.service";

export const loader = async ({
  params,
  request,
}: {
  params: { slug: string };
  request: Request;
}) => {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (params.slug === "create") {
    return json({ customPage: null });
  } else {
    const customPage = await getACustomPage(slug);

    return json({ customPage });
  }
};

const sectionHeadingClass =
  "text-gray-500 text-lg px-4 py-3 border-l-4 border-l-blue-500";

const labelClass = "block font-medium mb-2";

const InputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
const InputClassDisabled =
  "w-full rounded-lg border border-gray-300 bg-gray-200 px-3 py-2 text-base leading-8 text-gray-500 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function CreateCustomPages() {
  const [content, setContent] = useState("");
  const { customPage } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();

  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.success) {
      if (!toast.isActive("success-cp-toast")) {
        toast.success(data?.message || "Operation Successfully", {
          toastId: "success-cp-toast",
        });
      }
    } else if (data?.error) {
      if (!toast.isActive("error-cp-toast")) {
        toast.error(data?.error || "Something went wrong", {
          toastId: "error-cp-toast",
        });
      }
    }
  }, [data]);

  // * State to keep track of mapped steps section data
  const [stepsData, setStepsData] = useState([
    { step: 1, title: "", description: "", icon: "" },
    { step: 2, title: "", description: "", icon: "" },
    { step: 3, title: "", description: "", icon: "" },
  ]);

  // * State to keep track of mapped faqs section data
  const [faqData, setFaqData] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]); // * Six questions for faq section
  return (
    <div className="w-full">
      {/* Form With Stepper Navigation */}
      <Form
        method="post"
        key={customPage?.slug ?? "create"}
        encType="multipart/form-data"
        action={`/admin/dashboard/custom-pages/edit?slug=${
          customPage?.slug ?? "create"
        }&process=true`}
        className="w-full space-y-6"
      >
        {/*  Content */}
        <div className="space-y-6">
          {/* Page Details Section */}
          <section className={`w-full space-y-4 md:w-2/3`}>
            {/* Section Heading */}
            <h3 className={sectionHeadingClass}>Page Details</h3>

            {/* Input Fields */}

            {/* Page URL */}
            <div>
              <label htmlFor="slug" className={labelClass}>
                Page URL
              </label>
              <input
                id="slug"
                name="slug"
                className={customPage?.slug ? InputClassDisabled : InputClass}
                type="text"
                required={customPage ? false : true}
                placeholder="Enter your URL"
                defaultValue={customPage?.slug}
                disabled={!!customPage?.slug}
              />
            </div>

            {/* Banner Title */}
            <div>
              <label htmlFor="bannerTitle" className={labelClass}>
                Banner Title
              </label>
              <input
                id="bannerTitle"
                name="bannerTitle"
                className={InputClass}
                type="text"
                placeholder="Enter your Banner Title"
                defaultValue={customPage?.bannerSection?.bannerTitle}
              />
            </div>

            {/* Banner Subtitle */}
            <div>
              <label htmlFor="bannerSubtitle" className={labelClass}>
                Banner Subtitle
              </label>
              <input
                id="bannerSubtitle"
                name="bannerSubtitle"
                className={InputClass}
                type="text"
                placeholder="Enter your Banner Subtitle"
                defaultValue={customPage?.bannerSection?.bannerSubtitle}
              />
            </div>

            {/* Button Text */}
            <div>
              <label htmlFor="buttonText" className={labelClass}>
                Button Text
              </label>
              <input
                id="buttonText"
                name="buttonText"
                className={InputClass}
                type="text"
                placeholder="Enter your Button Text"
                defaultValue={customPage?.bannerSection?.buttonText}
              />
            </div>
          </section>

          {/* Steps Sections */}
          <section className={`w-full space-y-4 md:w-2/3`}>
            {/* Section Heading */}
            <h3 className={sectionHeadingClass}>Steps Section</h3>

            {/* Steps Section Title */}
            <div>
              <label htmlFor="stepsSectionTitle" className={labelClass}>
                Steps Section Title
              </label>
              <input
                id="stepsSectionTitle"
                name="stepsSectionTitle"
                className={InputClass}
                type="text"
                required
                placeholder="Enter your Steps Section Title"
                defaultValue={customPage?.stepsSection?.stepsSectionTitle}
              />
            </div>
          </section>

          {/* Steps */}
          <section className={`w-full space-y-4 md:w-2/3`}>
            {/* Dynamically render additional sections */}
            {["01", "02", "03"].map((section) => (
              <section key={nanoid()} className="my-5 w-full space-y-4">
                {/* Section Heading */}
                <h2 className={sectionHeadingClass}>Section {section}</h2>

                {/* Input Fields */}
                {/* Title Field */}
                <div>
                  <label
                    htmlFor={`sectionNo${section}Title`}
                    className={labelClass}
                  >
                    Title
                  </label>
                  <input
                    id={`sectionNo${section}Title`}
                    name={`sectionNo${section}Title`}
                    className={InputClass}
                    type="text"
                    required
                    placeholder={`Enter Title for Section ${section}`}
                    value={
                      stepsData[section - 1]?.title
                        ? stepsData[section - 1]?.title
                        : customPage?.stepsSection?.steps[section - 1]?.title
                    }
                    onBlur={(e) => {
                      // * onBlur to improve performance
                      const updatedStepsData = [...stepsData];
                      updatedStepsData[Number(section) - 1] = {
                        ...updatedStepsData[Number(section) - 1],
                        title: e.target.value,
                      };
                      setStepsData(updatedStepsData);
                    }}
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label
                    htmlFor={`sectionNo${section}Description`}
                    className={labelClass}
                  >
                    Description
                  </label>
                  <input
                    id={`sectionNo${section}Description`}
                    name={`sectionNo${section}Description`}
                    className={InputClass}
                    type="text"
                    required
                    placeholder={`Enter Description for Section ${section}`}
                    value={
                      stepsData[section - 1]?.description
                        ? stepsData[section - 1]?.description
                        : customPage?.stepsSection?.steps[section - 1]
                            ?.description
                    }
                    onBlur={(e) => {
                      const updatedStepsData = [...stepsData];
                      updatedStepsData[Number(section) - 1] = {
                        ...updatedStepsData[Number(section) - 1],
                        description: e.target.value,
                      };
                      setStepsData(updatedStepsData);
                    }}
                  />
                </div>

                {/* Icon Field */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex-1">
                    <label
                      htmlFor={`sectionNo${section}Icon`}
                      className={labelClass}
                    >
                      Icon
                    </label>
                    <textarea
                      className={InputClass}
                      value={
                        stepsData[Number(section) - 1]?.icon
                          ? stepsData[Number(section) - 1]?.icon
                          : customPage?.stepsSection?.steps[Number(section) - 1]
                              ?.icon
                      }
                      onBlur={(e) => {
                        const updatedStepsData = [...stepsData];
                        updatedStepsData[Number(section) - 1] = {
                          ...updatedStepsData[Number(section) - 1],
                          icon: e.target.value,
                        };
                        setStepsData(updatedStepsData);
                      }}
                      name={`sectionNo${section}Icon`}
                      id={`sectionNo${section}Icon`}
                      placeholder="Enter Icon for Section from Lucid Icon as SVG"
                    ></textarea>
                  </div>
                </div>
              </section>
            ))}
          </section>

          {/* Content Section */}
          <section className="w-full space-y-4 md:w-2/3">
            {/* Section Heading */}
            <h3 className={sectionHeadingClass}>Content</h3>

            {/* TextEditor  */}
            <div>
              <label htmlFor="content" className={labelClass}>
                Content
              </label>

              <MakeTipTapContent
                content={content}
                setContent={setContent}
                defaultContent={customPage?.content}
              />
            </div>
          </section>

          <section className="w-full space-y-4 md:w-2/3">
            {/* Section Heading */}
            <h3 className={sectionHeadingClass}>Schema Markup</h3>

            {/* Schema Markup */}
            <div>
              <div className="mb-4">
                <label
                  htmlFor="schemaMarkUp"
                  className="mb-2 block font-medium"
                >
                  Schema Markup
                </label>
                <textarea
                  id="schemaMarkUp"
                  name="schemaMarkUp"
                  defaultValue={customPage?.schemaMarkUp}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
          </section>

          {/* FAQ Sections */}
          <section className="w-full space-y-4">
            {/* Section Heading */}
            <h2 className={sectionHeadingClass}>FAQ Section</h2>

            {/* Q&A Input Fields */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={nanoid()}
                className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2"
              >
                {/* Question Input */}
                <div>
                  <label
                    htmlFor={`faqQuestion${index + 1}`}
                    className={labelClass}
                  >
                    Question {index + 1}
                  </label>
                  <input
                    id={`faqQuestion${index + 1}`}
                    name={`faqQuestion${index + 1}`}
                    className={InputClass}
                    type="text"
                    required
                    placeholder={`Enter Question ${index + 1}`}
                    value={
                      faqData[index]?.question
                        ? faqData[index]?.question
                        : (customPage?.faqSection || [])[index]?.question
                    }
                    onBlur={(e) => {
                      const updatedFaqData = [...faqData];
                      updatedFaqData[index] = {
                        ...updatedFaqData[index],
                        question: e.target.value,
                      };
                      setFaqData(updatedFaqData);
                    }}
                  />
                </div>

                {/* Answer Input */}
                <div>
                  <label
                    htmlFor={`faqAnswer${index + 1}`}
                    className={labelClass}
                  >
                    Answer {index + 1}
                  </label>
                  <textarea
                    id={`faqAnswer${index + 1}`}
                    name={`faqAnswer${index + 1}`}
                    className={InputClass}
                    required
                    placeholder={`Enter Answer ${index + 1}`}
                    value={
                      faqData[index]?.answer
                        ? faqData[index]?.answer
                        : (customPage?.faqSection || [])[index]?.answer
                    }
                    onBlur={(e) => {
                      const updatedFaqData = [...faqData];
                      updatedFaqData[index] = {
                        ...updatedFaqData[index],
                        answer: e.target.value,
                      };
                      setFaqData(updatedFaqData);
                    }}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
        {/* Submit Button */}
        <div className="mt-5 flex items-center justify-between gap-x-2">
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
        </div>
      </Form>
    </div>
  );
}
export const action = async ({ request }: { request: Request }) => {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");

  const shouldProcess = searchParams.get("process") === "true";

  if (!shouldProcess) {
    return json({ message: "No processing required" });
  }

  const formData = await request.formData();

  const payload: ICustomPage = {
    slug:
      pageSlug === "create"
        ? (formData.get("slug") as string)
        : (pageSlug as string),
    content: formData.get("content") as string,
    schemaMarkUp: formData.get("schemaMarkUp") as string,
    bannerSection: {
      bannerTitle: (formData.get("bannerTitle") as string) || "",
      bannerSubtitle: (formData.get("bannerSubtitle") as string) || "",
      buttonText: (formData.get("buttonText") as string) || "",
    },
    stepsSection: {
      stepsSectionTitle: formData.get("stepsSectionTitle") as string,
      steps: [
        {
          step: 1,
          title: formData.get("sectionNo01Title") as string,
          description: formData.get("sectionNo01Description") as string,
          icon: formData.get("sectionNo01Icon") as string,
        },
        {
          step: 2,
          title: formData.get("sectionNo02Title") as string,
          description: formData.get("sectionNo02Description") as string,
          icon: formData.get("sectionNo02Icon") as string,
        },
        {
          step: 3,
          title: formData.get("sectionNo03Title") as string,
          description: formData.get("sectionNo03Description") as string,
          icon: formData.get("sectionNo03Icon") as string,
        },
      ],
    },
    faqSection: [
      {
        question: formData.get("faqQuestion1") as string,
        answer: formData.get("faqAnswer1") as string,
      },
      {
        question: formData.get("faqQuestion2") as string,
        answer: formData.get("faqAnswer2") as string,
      },
      {
        question: formData.get("faqQuestion3") as string,
        answer: formData.get("faqAnswer3") as string,
      },
      {
        question: formData.get("faqQuestion4") as string,
        answer: formData.get("faqAnswer4") as string,
      },
      {
        question: formData.get("faqQuestion5") as string,
        answer: formData.get("faqAnswer5") as string,
      },
      {
        question: formData.get("faqQuestion6") as string,
        answer: formData.get("faqAnswer6") as string,
      },
    ],
  };

  if (pageSlug === "create") {
    const result = await createCustomPage(payload);

    return json({
      success: true,
      message: result?.message,
    });
  } else {
    const result = await updateCustomPage(pageSlug as string, payload);

    return json({
      success: true,
      message: result?.message,
    });
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  const response = isRouteErrorResponse(error) ? error : null;

  const buttonStyles =
    "px-4 py-3 block rounded-lg bg-[#6366F1] text-white border border-gray-300 hover:bg-gray-300 transition-colors";

  if (error instanceof Error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center text-gray-800">
        <h2 className="text-2xl font-semibold text-red-500">Error</h2>
        <p className="text-lg">{error?.message}</p>
        <Link to="/admin/dashboard/custom-pages">
          <button className={buttonStyles}>Go back to Custom Pages</button>
        </Link>
      </div>
    );
  }

  if (response) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center text-gray-800">
        <h2 className="text-2xl font-semibold text-red-500">
          {response?.status} {response?.statusText}
        </h2>
        <p className="text-lg">
          {response?.data?.message || "Something went wrong."}
        </p>
        <Link to="/admin/dashboard/custom-pages">
          <button className={buttonStyles}>Go back to Custom Pages</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center text-gray-800">
      <h2 className="text-2xl font-semibold">An unexpected error occurred</h2>
      <Link to="/admin/dashboard/custom-pages">
        <button className={buttonStyles}>Go back to Custom Pages</button>
      </Link>
    </div>
  );
}
