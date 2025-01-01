import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function NewsLetterSection() {
  const fetcher = useFetcher<typeof fetcher>();

  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher?.data?.success) {
      toast.success(fetcher?.data?.message || "Successfully Subscribed.");
    } else if (fetcher?.data?.error) {
      toast.error(fetcher?.data?.error || "Something went wrong.");
    }
  }, [fetcher.data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-4 px-4 md:px-8 py-8 md:py-16">
      {/* Text */}
      <h2 className="capitalize text-3xl md:text-4xl font-semibold text-center md:text-left">
        Subscribe to our <br />
        <span className="text-red-500">newsletter</span> now to <br />
        stay updated!
      </h2>

      {/* Form */}
      <div className="w-full">
        <fetcher.Form
          method="post"
          action="/api/newsletter"
          className="w-full lg:w-[70%] mr-0 ml-auto p-4 md:p-8 border rounded-xl shadow-md space-y-4"
        >
          <label
            htmlFor="newsLetterEmail"
            className="block text-2xl font-medium text-gray-500 text-center md:text-left"
          >
            Enter your email address to stay in touch
          </label>

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg mt-8 border border-transparent bg-red-500 px-10 py-2 text-lg font-semibold text-white focus:bg-red-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Subscribing" : "Subscribe"}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
