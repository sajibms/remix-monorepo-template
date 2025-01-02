/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useFetcher } from '@remix-run/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { FaPhone } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import Logo from './Logo';
import toast from 'react-hot-toast';

interface FooterProps {
  readonly logoPath: string;
  readonly footerSectionValue: any;
  readonly getFooterData: any;
}

export default function Footer({
  logoPath,
  footerSectionValue,
  getFooterData,
}: FooterProps) {
  const socialInfo = getFooterData[0].socialMedias;
  const legalAndContractInfo = getFooterData[0].legalAndContactInfo;

  const fetcher = useFetcher<any>();

  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher?.data?.success) {
      toast.success(fetcher?.data?.message || 'Successfully Subscribed.');
    } else if (fetcher?.data?.error) {
      toast.error(fetcher?.data?.error || 'Something went wrong.');
    }
  }, [fetcher.data]);

  const DMCATag = () => {
    return (
      <p title="DMCA.com Protection Status" className="dmca-badge">
        <img
          src="//images.dmca.com/Badges/dmca-badge-w150-5x1-01.png?ID=//www.dmca.com/Protection/Status.aspx?id=7ddfe973-234e-418d-9df7-5349e24bb3e1"
          alt="DMCA.com Protection Status"
          className="h-10"
        />
      </p>
    );
  };

  return (
    <footer className="bg-[#FFF6F6] flex flex-col md:flex-row gap-4 items-center justify-between w-full p-8 rounded-3xl my-5">
      {/* Logo and Description */}
      <div className="flex flex-col gap-4">
        <Logo logoPath={logoPath} />
        <p className="max-w-sm">{legalAndContractInfo.address}</p>

        {/* Social Icons */}
        <div className="flex gap-2">
          {socialInfo?.map((social) => (
            <Link
              to={social.link}
              key={social.socialMedia}
              className="prose w-8 h-8 rounded-lg bg-white flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: social.image }}
            />
          ))}
        </div>
        <p className="max-w-sm">{legalAndContractInfo.copyright}</p>

        <DMCATag />
      </div>

      <div className="flex flex-col gap-4 md:justify-end">
        <div className="flex flex-col md:flex-row gap-4 text-gray-600 md:justify-end">
          <Link to="/blogs">Blogs</Link>
          <a href="/sitemap.xml" target="_blank">
            Sitemap
          </a>
          <Link to="/about-us">About Us</Link>
          {footerSectionValue?.map(
            (section: { title: string; slug: string }) => (
              <Link key={nanoid()} to={section?.slug}>
                {section?.title}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-4 md:justify-end">
          <FaLocationDot />
          <p className="text-gray-400">{legalAndContractInfo.address}</p>
        </div>

        <div className="flex items-center gap-4 md:justify-end">
          <FaPhone />
          <p className="text-gray-400">{legalAndContractInfo.phoneNumber}</p>
        </div>

        <div className="flex items-center w-full md:justify-end">
          {/* Newsletter Subscription */}
          <fetcher.Form method="post" action="/api/newsletter">
            <div className="mx-auto mt-4 flex w-fit gap-0 rounded-xl border border-red-500 bg-white p-1">
              <input
                type="email"
                name="email"
                className="border-0  w-full px-2 text-gray-400 focus:outline-none"
                placeholder="Enter Your Email"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#EF4444] p-2 text-sm text-white"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </footer>
  );
}
