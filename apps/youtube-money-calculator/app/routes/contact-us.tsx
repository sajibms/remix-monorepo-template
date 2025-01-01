import { contactFormLoader, contactFormAction } from '@acme/UI/server';
import { ContactForm } from '@acme/UI';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect } from 'react';


export const loader = contactFormLoader;
export const action = contactFormAction;

export default function ContactUs() {
  const loaderData = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      if ('error' in actionData) {
        alert(actionData.error);
      } else if ('success' in actionData && actionData.success) {
        alert(actionData.message);
      }
    }
  }, [actionData]);

  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div>
      {/* Contact us Form */}
      <ContactForm contactUsData={loaderData} isSubmitting={isSubmitting} />
    </div>
  );
}
