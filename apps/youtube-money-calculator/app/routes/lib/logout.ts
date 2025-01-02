import { ActionFunctionArgs } from "@remix-run/node";

import { logout } from "@acme/models";


// logout action
export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
