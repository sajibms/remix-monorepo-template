import { IContactUsForm } from "@acme/types";
import { ContactUsForm } from "./contact-us-form.model";

export const storeMessageFromContact = async (payload: IContactUsForm) => {
  // * store message from contact us form
  const result = await ContactUsForm.create(payload);
  return result;
};
