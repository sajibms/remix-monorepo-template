import { json, LinksFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';

import { Navbar, Footer } from '@acme/UI';
import { getFooterSection, getGeneralSetting, getAllImportantPagesByTitle } from '@acme/models';

export const loader = async () => {
  //general setting
  const generalSetting = await getGeneralSetting();
  const footerImportantPage = await getAllImportantPagesByTitle();
  const getFooterData = await getFooterSection();
  return json({
    generalSettingData: generalSetting,
    footerImportantPage,
    getFooterData,
  });
};

export default function HomeLayout() {
  const { generalSettingData, footerImportantPage, getFooterData } =
    useLoaderData<typeof loader>();
  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']");
    if (faviconLink) {
      faviconLink.href = generalSettingData?.favicon || '/favicon.ico';
    }
  }, [generalSettingData]);
  return (
    <>
      <nav className="container mx-auto">
        <Navbar logoPath={generalSettingData?.logo ?? '/logoText.png'} />
      </nav>
      <main className="min-h-[300px] pt-28 container mx-auto">
        <Outlet />
        <Footer
          logoPath={generalSettingData?.logo ?? '/logoText.png'}
          footerSectionValue={footerImportantPage}
          getFooterData={getFooterData}
        />
      </main>
    </>
  );
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'icon',
      href: '/favicon.ico', // This can be a default favicon
    },
  ];
};
