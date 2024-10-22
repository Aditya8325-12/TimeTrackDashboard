import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Loader from "../componets/Loader";
const Login = () => {
  const [Loading, setLoading] = useState(false);
  const [erroMessage, seterroMessage] = useState("");
  const formdata = useRef();
  const navigate = useNavigate();

  const LoginUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = {
        email: formdata.current.email.value,
        password: formdata.current.pass.value,
      };

      const url = `${process.env.REACT_APP_BASE_URL}/admin/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        seterroMessage(errorData.message);
        return;
      }

      const userdata = await response.json();
      Cookies.set("data", JSON.stringify(userdata.data), { expires: 7 });
      Cookies.set("token", userdata.token, { expires: 7 });

      navigate("/");
      if (formdata.current) {
        formdata.current.reset();
      }
    } catch (error) {
      console.log("Fetch error =>", error);
      seterroMessage("Server Not Response");
    } finally {
      setTimeout(() => {
        setLoading(false);
        seterroMessage("");
      }, 4000);
      if (formdata.current) {
        formdata.current.reset();
      }
    }
  };

  if (Loading === true) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full flex items-center flex-col  relative">
      <div className=" w-4/12  p-6 space-y-8 sm:p-8 bg-white mt-4  rounded-lg shadow-xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to Flowbite
        </h2>
        <form className="mt-8 space-y-6" ref={formdata} onSubmit={LoginUser}>
          <div>
            <label
              // For="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label
              // For="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              name="password"
              id="pass"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className="ms-3 text-sm">
              <label
                // For="remember"
                className="font-medium text-gray-500 dark:text-gray-400"
              >
                Remember this device
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login to your account
          </button>
        </form>
        <h1 className="text-red-400 ">{erroMessage !== "" && erroMessage}</h1>
      </div>
      {erroMessage && (
        <div className="text-red-400 text-center">{erroMessage}</div>
      )}
    </div>
  );
};

export default Login;
