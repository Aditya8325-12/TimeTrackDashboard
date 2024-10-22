import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const [profile, setprofile] = useState(false);
  const navigate = useNavigate();

  const signOut = () => {
    Cookies.remove("data");
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-2xl w-full h-20 fixed z-20   flex justify-center items-center ">
      <div className="w-11/12 flex flex-wrap items-center justify-between ">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/images/logo.png" className="h-10" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Time Track
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className="hidden w-full md:flex md:w-auto items-center justify-center gap-5 relative"
          id="navbar-default"
        >
          <div className="relative  flex items-center gap-x-4 ">
            <div className="text-end">
              <h1 className="text-sm">Aditya Dhutraj</h1>
              <p className="text-xs"> admin</p>
            </div>
            <img
              onClick={() => {
                setprofile(!profile);
              }}
              src="https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyZWV8ZW58MHx8MHx8fDA%3D"
              alt=""
              className="h-10 w-10 rounded-full  cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 "
            />
          </div>

          <div
            className={`absolute right-0 z-10 w-44 mt-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
              profile ? "flex" : "hidden"
            } `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            <div className="py-1 flex flex-col  w-full items-end" role="none">
              {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
              <a
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-0"
              >
                Account settings
              </a>
              <button
                type="submit"
                className="block w-full px-4 py-2 text-end text-sm text-gray-700 hover:text-blue-400  "
                role="menuitem"
                tabIndex="-1"
                id="menu-item-3"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
