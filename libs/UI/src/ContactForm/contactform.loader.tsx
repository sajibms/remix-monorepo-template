export const contactFormLoader = async () => {
  return new Response(
    JSON.stringify({
      ENV: {
        SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};