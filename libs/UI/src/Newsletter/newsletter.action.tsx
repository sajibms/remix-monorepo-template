import { json } from "@remix-run/react";
import { storeNewsletterEmail } from "@acme/models";


export async function newsletterAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email) {
    return json({ success: false, message: 'Please enter a valid email address.' });
  }
  if (typeof email !== 'string') {
    return json({ error: 'Invalid email format.' });
  }

  try {
    const result = await storeNewsletterEmail({ email: email, });

    if (!result) {
      return json({ error: "Failed to subscribe. Please try again" }, { status: 400 });
    }

    return json({
      success: true,
      successFrom: "newsletter",
      message: "Thank you for subscribing to our newsletter!"
    }, { status: 200 })
  } catch (error) {
    console.error("Error subscribing newsletter:", error);
    return json({
      error: error instanceof Error ? error.message : "Failed to subscribe. Please try again",
      errorDetails: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
