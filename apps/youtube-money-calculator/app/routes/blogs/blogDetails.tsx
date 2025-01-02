import { useLoaderData } from "@remix-run/react";

import { IPostSetting } from "~/models/postSetting/postSetting.interface";
import { getPostBySlug } from "~/models/postSetting/postSetting.services";

import ViewTipTapContent from "~/components/TipTap/ViewTipTapContent";
import { getGeneralSetting } from "~/models/generalSettings/generalSetting.services";
import { Helmet } from "react-helmet";

export const loader = async ({ params }: { params: { slug: string } }) => {
  const blog = await getPostBySlug(params.slug);
  const generalSetting = await getGeneralSetting();
  return { blog, generalSetting };
};

export const meta = ({ data }: { data: IPostSetting }) => {
  if (!data) {
    return [
      { title: "Blog Not Found" },
      {
        name: "description",
        content: "The requested blog could not be found.",
      },
    ];
  }
  return [
    { title: data.slug },
    { name: "description", content: data.metaDescription },
  ];
};

export default function BlogDetails() {
  const { blog, generalSetting } = useLoaderData<typeof loader>();
  const blogPost = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": blog?.slug,
    headline: blog?.title,
    name: blog?.title,
    datePublished: blog?.createAt,
    dateModified: blog?.createAt,
    url: blog?.slug,
    publisher: {
      "@type": "Organization",
      "@id": generalSetting?.siteUrl,
      name: generalSetting?.title,
      logo: {
        "@type": "ImageObject",
        "@id": generalSetting?.logo,
        url: generalSetting?.logo,
        width: "600",
        height: "60",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${generalSetting?.siteUrl}/${blog?.slug}`,
      },
      // content: blog?.content,
    },
  };

  if (!blog) {
    return (
      <div className="mx-auto mt-6 p-5 sm:p-10 md:p-6">
        <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded">
          <div className="m-4 mx-auto -mt-16 space-y-6 p-6 pb-12 sm:mx-12 sm:px-10 lg:max-w-2xl lg:rounded-md dark:bg-gray-50">
            <div className="space-y-2">
              <h1 className="inline-block text-2xl font-semibold sm:text-3xl">
                Blog Not Found
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 p-5 sm:p-10 md:p-6">
      {" "}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogPost)}</script>
      </Helmet>
      <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded">
        <img
          src={blog.thumbnail}
          alt={blog.altText}
          className="h-60 w-full sm:h-96"
        />
        <div className="m-4 mx-auto -mt-16 space-y-6 p-6 pb-12 sm:mx-12 sm:px-10 lg:max-w-2xl lg:rounded-md dark:bg-gray-50">
          <div className="space-y-2">
            <h1 className="inline-block text-2xl font-semibold sm:text-3xl">
              {blog.title}
            </h1>
          </div>
          <div className="mt-4 text-base text-gray-600">
            <ViewTipTapContent content={blog.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
