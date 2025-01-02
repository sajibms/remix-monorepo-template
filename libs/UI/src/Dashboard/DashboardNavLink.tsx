import { NavLink } from "@remix-run/react";

export default function DashboardNavLink({ to, children, ...props }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-lg flex items-center gap-2 ${
          isActive ? "text-[#6366F1] font-semibold bg-white" : "text-gray-500"
        } hover:text-[#6366F1] px-2 py-3 rounded-md hover:shadow-sm`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}
