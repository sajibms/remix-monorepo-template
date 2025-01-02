import { type ActionFunctionArgs } from "@remix-run/node";
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Loading from "~/components/shared/Loading";
import MakeTipTapContent from "~/components/TipTap/MakeTipTapContent";
import { IImportantPages } from "~/models/important-pages/important-pages.interface";
import {
  createImportantPage,
  getSingleImportantPage,
  updateImportantPage,
} from "~/models/important-pages/important-pages.services";

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
    return json({ importantPage: null });
  } else {
    const importantPage = await getSingleImportantPage(slug);

    return json({ importantPage });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get("slug");

  const shouldProcess = searchParams.get("process") === "true";

  if (!shouldProcess) {
    return json({ message: "No processing required" });
  }

  const formData = await request.formData();
  const payload: IImportantPages = {
    slug:
      pageSlug === "create"
        ? (formData.get("slug") as string)
        : (pageSlug as string),
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  if (pageSlug === "create") {
    const result = await createImportantPage(payload);

    return json({
      success: true,
      message: result?.message,
    });
  } else {
    const result = await updateImportantPage(pageSlug as string, payload);

    return json({
      success: true,
      message: result?.message,
    });
  }
};

export default function CreateImportantPages() {
  const [content, setContent] = useState("");
  const { importantPage } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();

  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.success) {
      if (!toast.isActive("success-ip-toast")) {
        toast.success(data?.message || "Operation Successfully", {
          toastId: "success-ip-toast",
        });
      }
    } else if (data?.error) {
      if (!toast.isActive("error-ip-toast")) {
        toast.error(data?.error || "Something went wrong", {
          toastId: "error-ip-toast",
        });
      }
    }
  }, [data]);

  return (
    <div className="w-full">
      <Form
        method="post"
        key={importantPage?.slug ?? "create"}
        encType="multipart/form-data"
        action={`/admin/dashboard/important-pages/edit?slug=${
          importantPage?.slug ?? "create"
        }&process=true`}
        className="w-full space-y-6"
      >
        {/* Stepper Content */}
        <div className="space-y-6">
          {/* Page Details Section */}
          <section className={`w-full space-y-4 md:w-2/3`}>
            {/* Section Heading */}
            <h3 className={sectionHeadingClass}>Page Details</h3>

            {/* Input Fields */}

            {/* Page URL */}
            <div>
              <label htmlFor="slug" className={labelClass}>
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                className={
                  importantPage?.slug ? InputClassDisabled : InputClass
                }
                type="text"
                required={importantPage ? false : true}
                placeholder="Enter your URL"
                defaultValue={importantPage?.slug}
                disabled={!!importantPage?.slug}
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Title
              </label>
              <input
                id="title"
                name="title"
                className={InputClass}
                type="text"
                placeholder="Enter your Page Title"
                defaultValue={importantPage?.title}
              />
            </div>
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
                defaultContent={importantPage?.content}
              />
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-5 flex items-center justify-between gap-x-2">
          {/* Submit Button */}

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
        <Link to="/admin/dashboard/important-pages">
          <button className={buttonStyles}>Go back to Important Pages</button>
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
        <Link to="/admin/dashboard/important-pages">
          <button className={buttonStyles}>Go back to Important Pages</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center text-gray-800">
      <h2 className="text-2xl font-semibold">An unexpected error occurred</h2>
      <Link to="/admin/dashboard/important-pages">
        <button className={buttonStyles}>Go back to Important Pages</button>
      </Link>
    </div>
  );
}

const sectionHeadingClass =
  "text-gray-500 text-lg px-4 py-3 border-l-4 border-l-blue-500";

const labelClass = "block font-medium mb-2";

const InputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
const InputClassDisabled =
  "w-full rounded-lg border border-gray-300 bg-gray-200 px-3 py-2 text-base leading-8 text-gray-500 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
