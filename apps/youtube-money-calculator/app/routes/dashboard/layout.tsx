import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { CgWebsite } from "react-icons/cg";
import { CiSettings, CiTextAlignLeft } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { SlSettings } from "react-icons/sl";
import { TbSeo } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";
import { TiHomeOutline } from "react-icons/ti";

import DashboardNavBar from "~/components/dashboard/DashboardNavBar";
import DashboardNavLink from "~/components/dashboard/DashboardNavLink";
import { requireUserSession } from "~/models/auth/auth.services";

export async function loader({ request }: LoaderFunctionArgs) {
  // This ensures only authenticated users can access the dashboard
  await requireUserSession(request);

  return null;
}

export default function DashboardAppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full">
      {/* Mobile Menu Button */}
      <button
        className="p-4 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Navigation Links */}
      <main className="bg-[#F6F6FE]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-60 transform flex-col items-start overflow-y-auto bg-[#F6F6FE] px-4 py-8 transition-transform duration-300 lg:static lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-1 flex-col space-y-2">
            <DashboardNavLink to="/" onClick={() => setIsSidebarOpen(false)}>
              <TiHomeOutline className="text-2xl" /> Home
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/credential"
              onClick={() => setIsSidebarOpen(false)}
            >
              <RxAvatar className="text-2xl" /> Credential
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/general-settings"
              onClick={() => setIsSidebarOpen(false)}
            >
              <SlSettings className="text-2xl" /> General Settings
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/seo-settings"
              onClick={() => setIsSidebarOpen(false)}
            >
              <TbSeo className="text-2xl" /> SEO Settings
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/custom-pages"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CiTextAlignLeft className="text-2xl" /> Custom Pages
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/post-settings"
              onClick={() => setIsSidebarOpen(false)}
            >
              <TfiWrite className="text-2xl" /> Blog
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/footer-settings"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CgWebsite className="text-2xl" /> Footer Settings
            </DashboardNavLink>

            <DashboardNavLink
              to="/admin/dashboard/other-settings"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CiSettings className="text-2xl" /> Other Settings
            </DashboardNavLink>

            {/* More links */}
          </nav>
        </aside>
      </main>

      {/* Main Content */}
      <div className="w-full overflow-x-scroll">
        {/* Dashboard Nav Bar */}
        <DashboardNavBar />
        {/* Outlet */}
        <Outlet />
      </div>
    </div>
  );
}
