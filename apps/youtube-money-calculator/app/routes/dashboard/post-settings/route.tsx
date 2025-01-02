import { Form, json, Link, useLoaderData, useNavigate } from "@remix-run/react";

import {
  getAllPost,
  togglePostStatus,
} from "~/models/postSetting/postSetting.services";

export const loader = async () => {
  const posts = await getAllPost();
  return json({ posts });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const slug = formData.get("slug");

  if (typeof slug !== "string" || !slug) {
    return json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const updatedPost = await togglePostStatus(slug);

    return json({ success: true, updatedPost });
  } catch (error) {
    console.error("Error updating status:", error);
    return json({ error: "Failed to update status" }, { status: 500 });
  }
};

const PostSettingIndex = () => {
  const { posts } = useLoaderData<typeof loader>();
  const navigate = useNavigate(); // Hook for client-side navigation

  const handleEdit = (postSlug: string) => {
    navigate(`/admin/dashboard/post-settings/edit?slug=${postSlug}`);
  };
  return (
    <div className="space-y-8">
      {/* Create New Custom post */}
      <Link
        to="/admin/dashboard/post-settings/create"
        className="rounded-lg bg-[#6366F1] px-4 py-2 text-white"
      >
        + Create New
      </Link>
      <Link
        to="/admin/dashboard/post-settings/upload-csv"
        className="ml-5 rounded-lg bg-[#6366F1] px-4 py-2 text-white"
      >
        + Upload CSV
      </Link>

      {/* Table of Custom posts */}
      <div className="w-full overflow-x-auto rounded-xl border-[1px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b-[1px] bg-gray-100 text-xs text-gray-400">
            <tr className="max-h-16 rounded-2xl">
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-3 py-3">
                Post Name
              </th>
              <th scope="col" className="px-6 py-3">
                Slug
              </th>
              <th scope="col" className="px-6 py-3">
                Views
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Update Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post: any, ind: number) => (
                <tr key={ind} className="max-h-16 border-b">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                  >
                    {ind + 1}
                  </th>
                  <td>
                    <Link to={`/blogs/${post.slug}`} className="px-3 py-2">
                      {post.title || "N/A"}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{post.slug || "N/A"}</td>
                  <td className="px-6 py-4">{post.views || 0}</td>
                  <td className="px-6 py-4">
                    {(post.createdAt && post.createdAt.split("T")[0]) || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {post.status === "draft" ? "Draft" : "Published"}
                  </td>
                  <td className="px-6 py-4">
                    {/* Form to Update Status */}
                    <Form method="post">
                      <input type="hidden" name="slug" value={post.slug} />
                      <button
                        type="submit"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {post.status === "draft" ? "Publish" : "Unpublish"}
                      </button>
                    </Form>
                  </td>
                  <td className="relative px-6 py-4">
                    <button
                      onClick={() => handleEdit(post.slug)}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={7}
                    className="tex-2xl py-5 text-center font-bold text-gray-600"
                  >
                    Opps! No data found.
                  </td>
                </tr>
              </tbody>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostSettingIndex;
