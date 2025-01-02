import { NavLink } from "@remix-run/react";
import { useState } from "react";

import Logo from "./Logo";

export default function Navbar({ logoPath }: { readonly logoPath: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const NavLinkComponent = ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `transition hover:text-red-500 ${
            isActive
              ? "font-semibold text-red-500"
              : "text-gray-600 hover:text-red-500"
          } ${className ?? ""}`
        }
        onClick={() => window.innerWidth < 768 && setIsOpen(false)} // * Closes on mobile
      >
        {children}
      </NavLink>
    );
  };

  return (
    <nav className="container absolute mx-auto flex items-center justify-between px-4 py-5">
      {/* Logo with Home Link */}
      <div>
        <Logo logoPath={logoPath} />
      </div>

      {/* Hamburger Menu for Mobile Devices */}
      <button
        className="flex items-center text-red-500 focus:outline-none md:hidden"
        onClick={toggleMenu}
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </button>

      {/* Navigation Links for Mobile Devices */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute left-0 top-16 z-10 flex w-full flex-col gap-4 bg-white px-4 py-4 shadow-md md:static md:w-auto md:flex-row md:gap-6 md:px-0 md:py-0 md:shadow-none`}
      >
        <NavLinkComponent to="/">Home</NavLinkComponent>
        <NavLinkComponent to="/blogs">Blogs</NavLinkComponent>
        <NavLinkComponent to="/about-us">About Us</NavLinkComponent>
        <NavLinkComponent to="/contact-us">Contact Us</NavLinkComponent>
      </div>

      {/* Navigation Links for Larger Screens */}
      <div className="hidden gap-7 md:flex">
        <NavLinkComponent to="/">Home</NavLinkComponent>
        <NavLinkComponent to="/blogs">Blogs</NavLinkComponent>
        <NavLinkComponent to="/about-us">About Us</NavLinkComponent>
        <NavLinkComponent to="/contact-us">Contact Us</NavLinkComponent>
      </div>
    </nav>
  );
}
