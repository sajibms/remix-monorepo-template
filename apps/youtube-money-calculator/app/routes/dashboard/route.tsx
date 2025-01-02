import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { requireUserSession } from "~/models/auth/auth.services";

export async function loader({ request }: LoaderFunctionArgs) {
  // This ensures only authenticated users can access the dashboard
  await requireUserSession(request);

  return null;
}

export default function DashboardLayout() {
  return (
    <div className="p-5">
      <h2>This is the Root Dashboard Layout Page</h2>
    </div>
  );
}
