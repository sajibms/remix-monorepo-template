import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function ContactForm({ contactUsData, isSubmitting }) {
  const contact = contactUsData?.contactInfo;
  const location = contactUsData?.location?.legalAndContactInfo;
  const siteKey = contactUsData?.ENV?.SITE_KEY;

  const [storedToken, setStoredToken] = useState<string | null>(null);

  function getStoredToken() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setStoredToken(localStorage.getItem("_grecaptcha")); // * Google store token by this key in localstorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, ["_grecaptcha"]);
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    "g-recaptcha-response": storedToken || '',
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const [isClient, setIsClient] = useState(false);

  // * This is to ensure that the reCAPTCHA script is loaded before rendering the form
  useEffect(() => {
    setIsClient(true);

    // * Ensure reCAPTCHA script is loaded
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  if (!isClient) return null;

  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-9 p-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold ">{contact?.contactus?.contactusTitle}</h2>

        <p className="max-w-md text-gray-400 md:text-end">{contact?.contactus?.contactusDescription}</p>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-4 xl:gap-36 p-4">
        <div className="flex items-center justify-center gap-2 md:gap-10">
          <img src="/assets/contactUs.png" alt="Contact Us" className="w-1/2" />
          <div>
            <p className="text-lg font-medium text-gray-600">
              {contact?.contactus?.contactEmail}
            </p>
            <p className="mx-auto mt-2 max-w-md text-base text-gray-600">
              {location?.address}
            </p>
          </div>
        </div>
        {/* Form */}
        <div className="w-full">
          <div className="flex flex-col items-end w-full">
            <Form method="post" className="mt-6 p-6 shadow-2xl rounded-lg space-y-4 xl:w-[80%]">
              <div>
                <p className="text-2xl md:text-3xl font-semibold">Get a free quote</p>
                <p className="text-gray-400">Request your free, no-obligation quote today!</p>
              </div>

              {/* Name, Email, Message */}
              <div >
                <label htmlFor="name" className="block mb-2">Full Name</label>
                <input
                  required name="name" id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text" placeholder="Enter your name" className="block w-full px-5 py-3 mt-2 text-gray-700  bg-white border border-gray-200 rounded-md  focus:border-red-500 focus:ring-red-500 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div>

              <div >
                <label htmlFor="email" className="block mb-2 ">Email address</label>
                <input required
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email" id="email" type="email" placeholder="Enter your email address"
                  className="block w-full px-5 py-3 mt-2 text-gray-700  bg-white border border-gray-200 rounded-md focus:border-red-500 focus:ring-red-500 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 ">Message</label>
                <textarea
                  required name="message" id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="block w-full h-16 px-5 py-3 mt-2 text-gray-700  bg-white border border-gray-200 rounded-md md:h-56   focus:border-red-500  focus:ring-red-500 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Message"></textarea>
              </div>

              {/* Recaptcha */}
              <div
                className="g-recaptcha"
                data-sitekey={siteKey}
                data-callback={getStoredToken}
                data-value={formData["g-recaptcha-response"]}
              ></div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white bg-red-500 capitalize rounded-lg">
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}