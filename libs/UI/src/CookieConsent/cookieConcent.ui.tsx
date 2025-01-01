import { useFetcher } from '@remix-run/react';
import { useState, useEffect } from 'react';

export function CookieConsentBanner({ cookieName = 'cookie-consent' }) {
  const [isVisible, setIsVisible] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    // Check if consent has been given
    const hasConsent = localStorage.getItem(cookieName);

    // Show banner if no consent has been given
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, [cookieName]);

  const handleConsent = (accepted: boolean) => {
    // Set consent in localStorage
    localStorage.setItem(cookieName, accepted ? 'accepted' : 'declined');

    // Send consent status to server via action
    fetcher.submit(
      {
        consent: accepted ? 'accepted' : 'declined',
        cookieName,
      },
      { method: 'POST', action: '/api/cookie-consent' }
    );

    // Hide banner
    setIsVisible(false);
  };

  // Don't render if consent has been given
  if (!isVisible) return null;

  return (
    <div className="w-full fixed bottom-4 left-0">
      <div className="w-full md:w-1/2 mx-auto bg-white border rounded-md p-4 z-50 flex items-center justify-between shadow-xl">
        <div className="mr-4">
          <h2 className="text-lg font-bold text-gray-700">We use cookies</h2>
          <p className="text-sm max-w-xl text-gray-400">
            We need some cookies to keep things running smoothly & to understand
            how you use the site.
          </p>
        </div>
        <div className="flex space-x-2 font-medium">
          <button
            onClick={() => handleConsent(false)}
            className="bg-white hover:bg-red-600 text-gray-500 hover:text-white p-2 rounded flex items-center"
            aria-label="Decline Cookies"
          >
            Decline
          </button>
          <button
            onClick={() => handleConsent(true)}
            className="bg-[#5778FF] text-white p-2 rounded flex items-center"
            aria-label="Accept Cookies"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
