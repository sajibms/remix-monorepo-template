import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { requireUserSession } from "~/models/auth/auth.services";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await requireUserSession(request);
};
const CustomPagesLayout = () => {
  return (
    <div className="w-full p-10">
      <Outlet />
    </div>
  );
};

export default CustomPagesLayout;
