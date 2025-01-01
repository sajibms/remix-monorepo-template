import { useFetcher } from '@remix-run/react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export function TestForm() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post">
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <textarea name="message" placeholder="Message" />
      <button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </fetcher.Form>
  );
}
