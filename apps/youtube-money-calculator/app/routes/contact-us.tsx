import { contactFormLoader, contactFormAction } from '@acme/UI/server';
import { ContactForm } from '@acme/UI';

export const loader = contactFormLoader;
export const action = contactFormAction;

export default function ContactUs() {
  return <ContactForm />;
}
