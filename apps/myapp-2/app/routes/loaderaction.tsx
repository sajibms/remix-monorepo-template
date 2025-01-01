import { useLoaderData, useActionData } from '@remix-run/react';
import { useEffect } from 'react';
import { testAction, testLoader, TestLoaderAction } from '@acme/loader-action';

export const action = testAction;

export const loader =  testLoader;

export default function LoaderAction() {
  const actionMessage = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if (actionMessage) {
      console.log(actionMessage);
      alert(actionMessage.message);
    }
  }, [actionMessage]);

  return (
    <TestLoaderAction actionMessage={actionMessage} data={data} />
  );
}
