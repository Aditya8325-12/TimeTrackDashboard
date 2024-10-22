import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-700  "
      : "text-gray-900  md:hover:text-blue-700  ";
  };

  return (
    <form className="mt-4  border-gray-200">
      <ul role="list" className="px-2 py-3 font-medium text-gray-900">
        <li>
          <Link
            to={"/"}
            className={`  block cursor-pointer hover:text-blue-400 px-2 py-3  ${isActive(
              "/"
            )} `}
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/user"}
            className={`  block cursor-pointer hover:text-blue-400 px-2 py-3  ${isActive(
              "/user"
            )} `}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to={"/application"}
            className={`  block cursor-pointer hover:text-blue-400 px-2 py-3  ${isActive(
              "/application"
            )} `}
          >
            Application
          </Link>
        </li>
        <li>
          <Link
            to={"/notice"}
            className={`  block cursor-pointer hover:text-blue-400 px-2 py-3  ${isActive(
              "/notice"
            )} `}
          >
            Notice
          </Link>
        </li>
        <li>
          <Link
            to={"/holiday"}
            className={` block cursor-pointer hover:text-blue-400 px-2 py-3  ${isActive(
              "/holiday"
            )} `}
          >
            Holiday
          </Link>
        </li>
      </ul>
    </form>
  );
};

export default Sidebar;
