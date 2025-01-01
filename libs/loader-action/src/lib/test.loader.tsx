import { json, LoaderFunctionArgs } from "@remix-run/node";

export const testLoader = async ({ request }: LoaderFunctionArgs) => {
  console.log('loader', request.url);
  // * wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return json({
    message: 'Hello, world!',
  });
};