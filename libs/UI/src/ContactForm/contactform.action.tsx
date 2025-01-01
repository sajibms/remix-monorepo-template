import { json } from "@remix-run/react";
import { verifyRecaptcha } from "./utils/verifyRecaptcha";

export async function contactFormAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const name = formData.get('name') as string | null;
  const email = formData.get('email') as string | null;
  const message = formData.get('message') as string | null;
  const recaptchaToken = formData.get('g-recaptcha-response') as string | null;

  // * Define regex patterns
  const nameRegex = /^[a-zA-Z\s.,'’-]+$/; // * Allows alphabets, spaces, and title prefixes like Mr., Ms., etc.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // *Standard email format
  const messageRegex = /^(?!.*<.*?>)(?!^[0-9\s]*$)[a-zA-Z0-9\s']{10,500}$/;
  // * Ensures at least 10 characters, includes letters, is not numbers, don't include special characters and does not allow any tags

  // * Validate fields using regex and after successful testing send data to the db
  if (!name || !nameRegex.test(name)) {
    return json(
      { error: 'Invalid name. Only alphabets and spaces are allowed.' },
      { status: 400 }
    );
  }

  if (!email || !emailRegex.test(email)) {
    return json({ error: 'Invalid email format.' }, { status: 400 });
  }

  if (!message || !messageRegex.test(message)) {
    return json(
      {
        error:
          'Invalid message. It should be between 10 and 500 characters. No special characters allowed.',
      },
      { status: 400 }
    );
  }

  try {
    // * Validate reCAPTCHA token after all other validations, as one token can be validated only one time
    try {
      const verificationResponse = await verifyRecaptcha(
        recaptchaToken as string
      );

      if (!verificationResponse.success) {
        return json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'reCAPTCHA verification failed',
        },
        { status: 400 }
      );
    }

    return json({
      success: true,
      message: 'Successfully Sent Message.',
    });
  } catch (error) {
    console.error('Error storing message:', error);
    return json({
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again',
      errorDetails: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}