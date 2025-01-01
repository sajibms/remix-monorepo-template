import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';

import '../styles/loaderaction.css';
import { useLoaderData, useActionData } from '@remix-run/react';
import { json } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  return json({ message: formData.toString() }, { status: 200 });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    message: 'Hello, world!',
  });
};

export default function Loaderaction() {
  const actionMessage = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  return <p>Loaderaction works!</p>;
}
