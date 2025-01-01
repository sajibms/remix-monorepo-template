import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node';

import '../styles/testroute.css';
import { useLoaderData, useActionData } from '@remix-run/react';
import { json } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  return json({ message: formData.toString() }, { status: 200 });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log(request.url);
  return json({
    message: 'Hello, world!',
  });
};

export default function Testroute() {
  const actionMessage = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  console.log(actionMessage, data);
  return <p>Testroute works!</p>;
}
