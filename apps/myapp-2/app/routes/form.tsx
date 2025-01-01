import { testAction, testLoader } from '@acme/loader-action/server';
import { TestRawForm } from '@acme/loader-action';

export const action = testAction;
export const loader = testLoader;

export default function Form(): JSX.Element {
  return <TestRawForm />
}
