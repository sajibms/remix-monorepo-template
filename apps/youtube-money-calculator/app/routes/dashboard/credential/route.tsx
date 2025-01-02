import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  findUser,
  requireUserSession,
  updateUser,
} from "~/models/auth/auth.services";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "~/components/shared/Loading";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);

  const user = await findUser();
  return json({ user: user[0] });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors: { error?: string } = {};

  const payload: {
    username: string;
    password: string;
  } = {
    username: data.username as string,
    password: data.password as string,
  };

  const usernameRegex =
    /^(?!.*[_.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,18}[a-zA-Z0-9])?$/;

  // Server-side validation
  if (!usernameRegex.test(payload.username)) {
    errors.error =
      "Invalid username. Use 3-20 characters with letters, numbers, underscores, or periods. No consecutive or trailing special characters.";
  }

  if (!payload.password || payload.password.trim() === "") {
    errors.error = "Password is required";
  }

  const credentials = await updateUser(payload);

  if (credentials.status !== 200) {
    errors.error = credentials.error || "An error occurred while updating.";
    return json({ errors }, { status: 400 });
  }
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  return json({ success: true, message: "Credentials updated successfully" });
};

const Credentials = () => {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  // * Check if the form is submitting or loading
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      if (!toast.isActive("success-credential-toast")) {
        toast.success(actionData?.message || "Operation Successful", {
          toastId: "success-credential-toast",
        });
      }
    } else if (actionData?.error) {
      if (!toast.isActive("error-credential-toast")) {
        toast.error(actionData?.error || "Something went wrong", {
          toastId: "error-credential-toast",
        });
      }
    }
  }, [actionData]);

  return (
    <section className="body-font w-full p-5">
      <div className="w-full md:w-1/2 lg:w-1/3">
        <Form method="post" className="space-y-6">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={user?.username}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={user?.password}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            {actionData?.errors ? (
              <em className="text-red-500">{actionData.errors.error}</em>
            ) : null}
          </div>

          {isSubmitting ? (
            <Loading />
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg border border-transparent bg-[#6366F1] px-10 py-2 text-lg font-semibold text-white focus:bg-[#6366F1] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Save
            </button>
          )}
        </Form>
      </div>
    </section>
  );
};

export default Credentials;
