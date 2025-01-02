import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";

export default function DashboardNavBar() {
  const [exactPath, setExactPath] = useState("Dashboard");
  const location = useLocation();

  // * Helper function to format the path
  const formatPath = (path: string) => {
    if (!path) return "";
    return path
      .split("-") // * Split at dashes
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // * Capitalize each word
      .join(" "); // * Join with spaces
  };

  // * useEffect to update the exact path
  useEffect(() => {
    const path = location.pathname.split("/")[3];
    // * If the path is not empty, format it and update the state
    if (path) {
      setExactPath(formatPath(path)); // * Format the path while updating the state
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-between border-b border-gray-200 bg-white px-4 py-4 md:flex-row">
      {/* Display the exact path */}
      <p className="text-xl text-[#666C79]">{exactPath}</p>

      {/* Log out & Visit Website Buttons */}
      <div className="flex items-center gap-4">
        <form method="post" action="/logout">
          <button className="rounded-md border-2 px-4 py-2 hover:cursor-pointer">
            <FiLogOut className="inline-block text-xl" /> Log out
          </button>
        </form>
        <Link to="/" className="rounded-md border-2 px-4 py-2">
          Visit Website <GoArrowUpRight className="inline-block text-xl" />
        </Link>
      </div>
    </div>
  );
}
