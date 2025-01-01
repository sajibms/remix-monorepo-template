import { ActionFunctionArgs } from "@remix-run/node";

export const testAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(formData);

  // * wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Data submitted successfully',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};