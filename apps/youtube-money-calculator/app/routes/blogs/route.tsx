import { Link, useLoaderData } from "@remix-run/react";
import { nanoid } from "nanoid";

import { getAllPublicPost } from "~/models/postSetting/postSetting.services";

export const loader = async () => {
  const blogs = await getAllPublicPost();
  return blogs;
};

export default function Blogs() {
  const blogs = useLoaderData<typeof loader>();

  return (
    <section>
      {/* Introduction */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-9 p-2 xl:p-0 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-600">Read blogs</h2>

        <p className="max-w-md text-gray-400 md:text-end">Follow our quick and easy process to generate beautiful, AI-powered palettes tailored to your needs.</p>
      </div>

      {/* Blogs */}

      {
        blogs.map((blog) => (
          <section key={nanoid()} >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 xl:p-0 mb-10">
              <img
                className="object-cover w-full lg:w-2/5 h-60 rounded-xl"
                src={blog.thumbnail}
                alt="Blog"
              />

              <div className="lg:w-3/5 h-full space-y-4">
                <p className="block mt-4 text-2xl font-semibold text-gray-600 ">
                  {blog.title}
                </p>

                <div
                  dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 350) + "..." }}
                />

                <Link
                  to={`/blogs/${blog.slug}`}
                  className="inline-block mt-2 text-red-500 underline "
                >
                  Continue Reading
                </Link>
              </div>
            </div>
          </section>
        ))
      }
    </section>
  );
}
