import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";


export function TestRawForm() {
  const actionData = useActionData();
 
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';
  
  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData?.message);
    } else if (actionData?.error) {
      toast.error(actionData?.error);
    }
  }, [actionData]);

  return (
    <Form method="post">
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <textarea name="message" placeholder="Message" />
      <button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  );
}