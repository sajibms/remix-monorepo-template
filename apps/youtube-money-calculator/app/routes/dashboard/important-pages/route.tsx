/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  getAllImportantPages,
} from "~/models/important-pages/important-pages.services";

export const loader = async () => {
  const importantPages = await getAllImportantPages();
  return json({ importantPages });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const slug = formData.get("slug");

  if (typeof slug !== "string" || !slug) {
    return json({ error: "Invalid slug" }, { status: 400 });
  }

};

const ImportantPageTable = () => {
  const { importantPages } = useLoaderData<typeof loader>();
  const navigate = useNavigate(); // Hook for client-side

  const handleEdit = (pageSlug: string) => {
    try {
      navigate(`/admin/dashboard/important-pages/edit?slug=${pageSlug}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  return (
    <div className="space-y-8">
      {/* Create New important Page */}
      <Link
        to="/admin/dashboard/important-pages/create"
        className="rounded-lg bg-[#6366F1] px-4 py-2 text-white"
      >
        + Create New
      </Link>

      {/* Table of important Pages */}
      <div className="w-full overflow-x-auto rounded-xl border-[1px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b-[1px] bg-gray-100 text-xs text-gray-400">
            <tr className="max-h-16 rounded-2xl">
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-3 py-3">
                Title
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {importantPages.length > 0 ? (
              importantPages.map((page: any, ind: number) => (
                <tr key={ind} className="max-h-16 border-b">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                  >
                    {ind + 1}
                  </th>
                  <td>
                    <Link to={`/${page.slug}`} className="px-3 py-2">
                      {page.title || "N/A"}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{page.slug || "N/A"}</td>
                  <td className="px-6 py-4">{page.views || 0}</td>
                  <td className="px-6 py-4">
                    {(page.createdAt && page.createdAt.split("T")[0]) || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    Published
                  </td>
                  <td className="relative px-6 py-4">
                    <Form
                      method="post"
                      action={`/admin/dashboard/important-pages/edit?slug=${page.slug}`}
                    >
                      <button
                        type="submit"
                        // onClick={() => handleEdit(page.slug)}
                        className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        Edit
                      </button>
                    </Form>
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

export default ImportantPageTable;
