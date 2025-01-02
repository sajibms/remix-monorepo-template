import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUserSession, verifyLogin } from "@acme/models";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const errors = {};

    const payload: {
      username: string;
      password: string;
    } = {
      username: data.username as string,
      password: data.password as string,
    };

    const user = await verifyLogin(payload.username, payload.password);
    if (user.status === 404 || user.status === 401) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (user.status === 401 || user.status === 404) {
      errors.error = "Invalid credentials";
    }
    if (Object.keys(errors).length > 0) {
      return json({ errors });
    }

    return createUserSession(
      user.data?._id as string,
      "/admin/dashboard/credential"
    );
  } catch (error) {
    console.error(error); // Log error for debugging
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

const Auth = () => {
  const actionData = useActionData<typeof action>();
  return (
    <section className="body-font text-gray-600 flex min-h-screen items-center justify-center bg-gray-100">
      <Form method="post" className="container flex justify-center px-5 py-24">
        <div className="z-10 mt-10 flex w-96 flex-col rounded-lg bg-white p-8 shadow-md">
          <h2 className="title-font mb-1 text-lg font-medium text-gray-900">
            Login
          </h2>
          <p className="mb-5 leading-relaxed text-gray-600">
            Please login using your credentials.
          </p>
          <div className="relative mb-4">
            <label
              htmlFor="username"
              className="text-sm leading-7 text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="text-sm leading-7 text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {actionData?.error ? (
            <em className="text-red-500">{actionData.error}</em>
          ) : null}

          <button
            type="submit"
            className="rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
          >
            Login
          </button>
        </div>
      </Form>
    </section>
  );
};

export default Auth;
