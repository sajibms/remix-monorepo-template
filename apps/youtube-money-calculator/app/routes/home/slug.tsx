import { json, useLoaderData } from '@remix-run/react';

import { Helmet } from 'react-helmet';

import BannerSection from '~/components/UI/CustomPage/BannerSection';
import FAQSection from '~/components/UI/CustomPage/FAQSection';
import StepsSection from '~/components/UI/CustomPage/StepsSection';
import HowAreBestSection from '~/components/UI/CustomPage/HowAreBestSection';
import { ViewTipTapContent } from '@acme/UI';
import {
  getACustomPageBasedOnSlug,
  getGeneralSetting,
  getSingleImportantPage,
} from '@acme/models';

export const loader = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  console.log('slug', slug);
  console.log('params', params);
  const result = await getACustomPageBasedOnSlug(slug);
  const generalSetting = await getGeneralSetting();
  if (!result) {
    const importantPage = await getSingleImportantPage(slug);
    return json({ importantPage });
  }
  return json({ result, generalSetting });
};

export const DynamicRoute = () => {
  const { result, importantPage, generalSetting } =
    useLoaderData<typeof loader>();

  const blogPost = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': result?.slug ?? importantPage?.slug,
    headline: result?.title ?? importantPage?.title,
    name: result?.title ?? importantPage?.title,
    datePublished: result?.createAt ?? importantPage?.createAt,
    dateModified: result?.createAt ?? importantPage?.createAt,

    url: result?.slug ?? importantPage?.slug,
    publisher: {
      '@type': 'Organization',
      '@id': generalSetting?.siteUrl,
      name: generalSetting?.title,
      logo: {
        '@type': 'ImageObject',
        '@id': generalSetting?.logo,
        url: generalSetting?.logo,
        width: '600',
        height: '60',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${generalSetting?.siteUrl}/${importantPage?.slug}`,
      },
      content: result?.content,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: result?.faqSection?.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  if (!result) {
    return (
      <div className="px-4 py-6">
        <h1 className="pb-10 text-center text-5xl">{importantPage?.title}</h1>
        <ViewTipTapContent
          content={blogPost?.content ?? importantPage?.content}
        />{' '}
      </div>
    );
  }
  return (
    <div>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogPost)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="my-10">
        <BannerSection data={result?.bannerSection} />
      </div>

      <StepsSection stepsSectionData={result?.stepsSection} />
      <NewsLetterSection />
      <HowAreBestSection content={result?.content ?? ''} />
      <FAQSection faqList={result?.faqSection} />
    </div>
  );
};

export default DynamicRoute;
