import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GoStop } from "react-icons/go";
import Loader from "../componets/Loader";
import { convertdateToNameDatetring } from "../componets/Data";
const User = () => {
  const navigate = useNavigate();

  const [Loading, setLoading] = useState(false);

  const [UserData, setUserData] = useState([]);
  const [Userid, setUserid] = useState(null);

  const [erroMessage, seterroMessage] = useState("");

  const [deleteView, setdeleteView] = useState(false);
  const [currentpageIndex, setcurrentpageIndex] = useState(0);

  useEffect(() => {
    fetchData();
    // This disables the exhaustive-deps rule for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = Cookies.get("token");

    if (!token) {
      seterroMessage("No token found, please login.");
      navigate("/login");
      return;
    }
    const url = `${process.env.REACT_APP_BASE_URL}/admin/alluser`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        seterroMessage(errorData.message || "Unauthorized access");
        navigate("/login");
      } else {
        const userdata = await response.json();
        setUserData(userdata.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      seterroMessage("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const deletedata = async () => {
    try {
      setLoading(true);
      if (Userid !== "") {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
        }
        const body = { _id: Userid };
        const url = `${process.env.REACT_APP_BASE_URL}/admin/deleteuser`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
            "Content-Type": "application/json", // Correctly formatted Content-Type header
          },
          body: JSON.stringify(body), // Body content
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.message);
        }

        await fetchData();
      } else {
        seterroMessage("holiday id not found ");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setdeleteView(false);
      setLoading(false);
    }
  };

  if (Loading === true) {
    return <Loader />;
  }
  return (
    <div className="  w-full relative  flex  px-6 pt-6 flex-col ">
      <div className="flex flex-col   md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="flex-1 flex items-center space-x-2 ">
          <h5>
            <span className="text-gray-500">All Users : </span>
            <span className="">{UserData.length}</span>
          </h5>
          <h5 className="text-gray-500  ml-1">
            1 - {parseInt(UserData.length / 6) + 1}
          </h5>
        </div>
      </div>

      <div className="overflow-x-auto  ">
        <table className="w-full text-sm text-left  text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">Sr.No</div>
              </th>
              <th scope="col" className="p-4">
                Full Name
              </th>
              <th scope="col" className="p-4">
                User Name
              </th>
              {/* <th scope="col" className="p-4">
            Password
          </th> */}
              <th scope="col" className="p-4">
                Email
              </th>
              <th scope="col" className="p-4">
                Created Date
              </th>

              <th scope="col" className="p-4">
                Last Update
              </th>
            </tr>
          </thead>
          <tbody>
            {UserData.slice(currentpageIndex, currentpageIndex + 6).map(
              (items, index) => {
                return (
                  <tr
                    key={items._id}
                    className="border-b cursor-pointer  hover:bg-gray-200 "
                  >
                    <td className="p-4 w-4">
                      <div className="flex items-center">{index + 1}</div>
                    </td>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                    >
                      <div className="flex items-center mr-3">{items.name}</div>
                    </th>
                    <td className="px-4 py-3">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded ">
                        {items.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap ">
                      {items.email}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap ">
                      {convertdateToNameDatetring(items.createDate)}
                    </td>

                    <td className="px-4 py-3">
                      {convertdateToNameDatetring(items.updatedDate)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap ">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/user/userdetails", {
                              state: { _id: items._id },
                            });
                          }}
                          data-drawer-target="drawer-read-product-advanced"
                          data-drawer-show="drawer-read-product-advanced"
                          aria-controls="drawer-read-product-advanced"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200      "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 mr-2 -ml-0.5"
                          >
                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                            />
                          </svg>
                          Preview
                        </button>
                        <button
                          type="button"
                          data-modal-target="delete-modal"
                          data-modal-toggle="delete-modal"
                          onClick={() => {
                            setdeleteView(true);
                            setUserid(items._id);
                          }}
                          className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center     "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 -ml-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex  flex-col md:flex-row justify-end items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <ul className=" items-stretch gap-4 flex  -space-x-px">
          {currentpageIndex >= 6 && (
            <li>
              <button
                onClick={() => {
                  setcurrentpageIndex(currentpageIndex - 6);
                }}
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700     "
                aria-label="Previous" // For screen readers
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>Previous</p>
              </button>
            </li>
          )}

          {currentpageIndex + 6 < UserData.length && (
            <li>
              <button
                onClick={() => {
                  setcurrentpageIndex(currentpageIndex + 6);
                }}
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700     "
                aria-label="Next" // For screen readers
              >
                <p>Next</p>
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div
        className={`w-full h-full   absolute justify-center items-center ${
          deleteView ? "flex" : "hidden"
        } `}
      >
        {/* delete module */}
        <div
          className={`  w-4/12  flex justify-center items-center  ${
            deleteView ? "absolute" : "hidden"
          } `}
        >
          <div class="relative w-full h-auto ">
            <div class="relative bg-white  rounded-lg shadow-2xl ">
              <button
                onClick={() => {
                  setdeleteView(false);
                }}
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                data-modal-toggle="delete-modal"
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewbox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="p-6 text-center w-full flex justify-center items-center flex-col">
                <GoStop className="w-8 h-8  my-5 text-center" />
                <h3 class="mb-5 text-lg font-normal text-gray-500 ">
                  Are you sure you want to delete this product?
                </h3>
                <div className="w-full flex justify-center items-center gap-8 ">
                  <button
                    onClick={() => {
                      deletedata();
                    }}
                    data-modal-toggle="delete-modal"
                    type="button"
                    class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    data-modal-toggle="delete-modal"
                    type="button"
                    class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10      "
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {erroMessage && (
        <div className="text-red-400 text-center">{erroMessage}</div>
      )}
    </div>
  );
};

export default User;
