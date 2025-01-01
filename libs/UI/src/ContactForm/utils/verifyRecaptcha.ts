export async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error('reCAPTCHA secret key is not configured');
  }

  const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';

  try {
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    return {
      success: data.success,
      errorCodes: data['error-codes'] || [],
      challengeTs: data['challenge_ts'],
      hostname: data['hostname'],
    };
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    throw error;
  }
}