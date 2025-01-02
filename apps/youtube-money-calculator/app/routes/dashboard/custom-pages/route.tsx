/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";

import {
  getAllCustomPages,
  getHomePage,
  toggleCustomPageStatus,
} from "~/models/custom-page/custom-page.service";

export const loader = async () => {
  const customPages = await getAllCustomPages();
  const homePage = await getHomePage();
  return json({ customPages, homePage });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const slug = formData.get("slug");

  if (typeof slug !== "string" || !slug) {
    return json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const updatedPage = await toggleCustomPageStatus(slug);

    return json({ success: true, updatedPage });
  } catch (error) {
    console.error("Error updating status:", error);
    return json({ error: "Failed to update status" }, { status: 500 });
  }
};

const CustomPageTable = () => {
  const { customPages, homePage } = useLoaderData<typeof loader>();
  const navigate = useNavigate(); // Hook for client-side navigation

  // will work on it in near future.
  // const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  // const toggleDropdown = (index: number) => {
  //   setDropdownOpen((prev) => (prev === index ? null : index));
  // };

  const handleEdit = (pageSlug: string) => {
    try {
      navigate(`/admin/dashboard/custom-pages/edit?slug=${pageSlug}`);
      // navigate(
      //   `/admin/dashboard/custom-pages/edit?slug=${pageSlug}&section=${section}`,
      // );
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  return (
    <div className="space-y-8">
      {/* Create New Custom Page */}
      <Link
        to="/admin/dashboard/custom-pages/create"
        className="rounded-lg bg-[#6366F1] px-4 py-2 text-white"
      >
        + Create New
      </Link>

      {/* Table of Custom Pages */}
      <div className="w-full overflow-x-auto rounded-xl border-[1px]">
        <table className="w-full text-left text-sm">
          <thead className="border-b-[1px] bg-gray-100 text-xs text-gray-400">
            <tr className="max-h-16 rounded-2xl">
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-3 py-3">
                Custom Page Name
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
            <tr className="max-h-16 border-b">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
              >
                1
              </th>
              <td>
                <Link to={`/`} className="px-3 py-2">
                  Home
                </Link>
              </td>
              <td className="px-6 py-4">home</td>
              <td className="px-6 py-4">{homePage?.views || 0}</td>
              <td className="px-6 py-4">
                {homePage?.createdAt
                  ? homePage.createdAt.split("T")[0]
                  : "2024-01-01"}
              </td>
              <td className="px-6 py-4">{"Published"}</td>
              <td className="px-6 py-4 font-medium text-red-500 opacity-50">
                Draft
              </td>
              <td className="relative px-6 py-4">
                <button
                  onClick={() => handleEdit("home")}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Edit
                </button>
              </td>
            </tr>
            {customPages.length > 0 ? (
              customPages.map((page: any, ind: number) => (
                <tr key={ind} className="max-h-16 border-b">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                  >
                    {ind + 2}
                  </th>
                  <td>
                    <Link to={`/${page.slug}`} className="px-3 py-2">
                      {page.bannerSection?.bannerTitle || "N/A"}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{page.slug || "N/A"}</td>
                  <td className="px-6 py-4">{page.views || 0}</td>
                  <td className="px-6 py-4">
                    {(page.createdAt && page.createdAt.split("T")[0]) || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {page.status === "draft" ? "Draft" : "Published"}
                  </td>
                  <td className="px-6 py-4">
                    {/* Form to Update Status */}
                    <Form method="post">
                      <input type="hidden" name="slug" value={page.slug} />
                      <button
                        type="submit"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {page.status === "draft" ? "Publish" : "Draft"}
                      </button>
                    </Form>
                  </td>
                  <td className="relative px-6 py-4">
                    <Form
                      method="post"
                      action={`/admin/dashboard/custom-pages/edit?slug=${page.slug}`}
                    >
                      <button
                        // will work on it in near future.
                        // onClick={() => toggleDropdown(ind)}
                        type="submit"
                        // onClick={() => handleEdit(page.slug)}
                        className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        Edit
                      </button>
                    </Form>
                    {/* will work on it in near future. */}
                    {/* {dropdownOpen === ind ? (
                      <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg">
                        <ul className="py-1 text-gray-700">
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() =>
                                handleEdit("Page-Details", page.slug)
                              }
                            >
                              Edit Page Details
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() =>
                                handleEdit("Steps-Section", page.slug)
                              }
                            >
                              Edit Steps Section
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() =>
                                handleEdit("FAQ-Section", page.slug)
                              }
                            >
                              Edit FAQ Section
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : null} */}
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

export default CustomPageTable;
