import { useLoaderData } from '@remix-run/react';
import { testAction, testLoader } from '@acme/loader-action/server';
import { TestForm } from '@acme/loader-action';

export const action = testAction;
export const loader = testLoader;

export default function LoaderAction() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Welcome to LoaderAction!</h1>
      <TestForm />
      <p>{data.message}</p>
    </div>
  );
}
