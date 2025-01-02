import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Helmet } from "react-helmet";
import BannerSection from "~/components/UI/CustomPage/BannerSection";

import NewsLetterSection from "~/components/UI/CustomPage/NewsLetterSection";
import StepsSection from "~/components/UI/CustomPage/StepsSection";
import FAQSection from "~/components/UI/CustomPage/FAQSection";
import HowAreBestSection from "~/components/UI/CustomPage/HowAreBestSection";
import { getACustomPageBasedOnSlug } from "~/models/custom-page/custom-page.service";
import { getGeneralSetting } from "~/models/generalSettings/generalSetting.services";
import { getMetaInfo } from "~/models/seo-setting/seo-setting.services";

export const loader = async () => {
  const data = await getMetaInfo();
  // const siteInfo = await getGeneralSetting()
  const page = await getACustomPageBasedOnSlug("home");
  const generalSetting = await getGeneralSetting();

  return json({ data, page, generalSetting });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { generalSetting, seoSetting } = data!.data;
  const generalTitle = generalSetting?.[0]?.title || "Default Site Title";
  const generalDescription =
    generalSetting?.[0]?.description || "Default Site Description";
  const seoSeparator = seoSetting?.[0]?.titleSeparator || "-";
  const favicon = generalSetting?.[0]?.favicon || "";
  return [
    {
      title: `${generalTitle} ${seoSeparator} description`,
    },
    {
      name: "description",
      content: generalDescription,
    },
    { favicon: favicon },

    { charset: "utf-8" },
  ];
};

export default function Index() {
  const { page, generalSetting } = useLoaderData<typeof loader>();

  const blogPost = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": page?.slug,
    headline: page?.title,
    name: page?.title,
    datePublished: page?.createAt,
    dateModified: page?.createAt,

    url: page?.slug,
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
        "@id": `${generalSetting?.siteUrl}/${page?.slug}`,
      },
      // content: page?.content,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page?.faqSection?.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogPost)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="my-10">
        <BannerSection data={page?.bannerSection} />
      </div>
      <StepsSection stepsSectionData={page?.stepsSection} />
      <NewsLetterSection />
      <HowAreBestSection content={page?.content} />
      <FAQSection faqList={page?.faqSection} />
    </div>
  );
}
