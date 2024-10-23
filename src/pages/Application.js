import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GoStop } from "react-icons/go";
import { TiCancel } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { convertdateToNameDatetring } from "../componets/Data";
import { TbHandClick } from "react-icons/tb";
import Loader from "../componets/Loader";
const Application = () => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [PendingData, setPendingData] = useState([]);
  const [RejectedData, setRejectedData] = useState([]);
  const [aproveData, setaproveData] = useState([]);
  const [adminData, setadminData] = useState();
  const [successModel, setsuccessModel] = useState(false);
  const [successMessege, setsuccessMessege] = useState("");
  const [erroMessage, seterroMessage] = useState("");
  const [deleteView, setdeleteView] = useState(false);
  const [actionModule, setactionModule] = useState(false);
  const [actionData, setactionData] = useState();
  const [AproveModule, setAproveModule] = useState(false);
  const [leavecode, setleavecode] = useState("");
  const [student_id, setstudent_id] = useState("");
  const [status, setstatus] = useState("");
  const [leaveId, setleaveId] = useState("");

  const [fillterOption, setfillterOption] = useState(false);
  // pagination
  const [currentpageIndex, setcurrentpageIndex] = useState(0);
  const fetchData = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    const data = await Cookies.get("data");
    if (data) {
      const parsedData = JSON.parse(data);
      setadminData(parsedData);
    } else {
      console.log("No data found in cookies");
    }
    if (!token) {
      navigate("/login");
    }

    const url = `${process.env.REACT_APP_BASE_URL}/admin/application`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        seterroMessage(errorData.message || "Unauthorized access");
        navigate("/login");
      } else {
        const userdata = await response.json();
        const data = await userdata.application.flat();

        setUserData(data);
        const pData = await data.filter(
          (item) => item.sanctionedStatus === "pending"
        );
        const RData = await data.filter(
          (item) => item.sanctionedStatus === "Rejected"
        );
        const AData = await data.filter(
          (item) => item.sanctionedStatus === "Approve"
        );
        setPendingData(pData);
        setRejectedData(RData);
        setaproveData(AData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      seterroMessage("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const UpdateData = async () => {
    try {
      setLoading(true);
      if (
        leaveId !== "" &&
        leavecode !== "" &&
        student_id !== "" &&
        status !== "" &&
        adminData.name !== ""
      ) {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
        }
        const body = {
          leaveId,
          leavecode,
          student_id,
          status,
          adminName: adminData.name,
        };

        const url = `${process.env.REACT_APP_BASE_URL}/admin/updateApplication`;
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
        const userdata = await response.json();
        setsuccessMessege(userdata.message);
        setsuccessModel(true);
        await fetchData();
      } else {
        seterroMessage("plese add the all filed ");
      }
    } catch (error) {
      console.log(error.message);
      seterroMessage(error.message);
    } finally {
      setLoading(false);
      setactionModule(false);
      setdeleteView(false);
      setAproveModule(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
    // This disables the exhaustive-deps rule for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
    // This disables the exhaustive-deps rule for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Loading === true) {
    return <Loader />;
  }

  return (
    <div className="  w-full relative  flex  px-6 pt-6 flex-col ">
      <div className="flex flex-col   md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="flex-1 flex items-center space-x-2 ">
          <h5>
            <span className="text-gray-500">All Application : </span>
            <span className=" ">{UserData.length}</span>
          </h5>
          <h5 className="text-gray-500   ml-1">
            1 - {parseInt(UserData.length / 6) + 1}
          </h5>
        </div>
        <div className="flex-shrink-0 flex relative flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3">
          <div>
            <button
              type="button"
              onClick={() => {
                setfillterOption(!fillterOption);
              }}
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-4 w-4 mr-1.5 -ml-1 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              Filter options
            </button>
          </div>

          <div
            className={` ${
              fillterOption === true ? "absolute" : "hidden"
            }  right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                onClick={() => {
                  setfillterOption(false);
                  fetchData();
                }}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex={0} // Make it keyboard accessible
                id="menu-item-0"
              >
                All
              </button>
              <button
                onClick={() => {
                  setfillterOption(false);
                  setUserData(PendingData);
                }}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex={0} // Make it keyboard accessible
                id="menu-item-1"
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setUserData(RejectedData);
                  setfillterOption(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex={0} // Make it keyboard accessible
                id="menu-item-2"
              >
                Rejected
              </button>
              <button
                onClick={() => {
                  setfillterOption(false);
                  setUserData(aproveData);
                }}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex={0} // Make it keyboard accessible
                id="menu-item-3"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t  ">
        <div className="w-full md:w-1/2">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500  "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                placeholder="Search for products"
                required=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2        "
              />
            </div>
          </form>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={() => {
                  setfillterOption(!fillterOption);
                }}
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 mr-1.5 -ml-1 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filter options
              </button>
            </div>

            <div
              className={` ${
                fillterOption === true ? "absolute" : "hidden"
              }  right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none `}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                <button
                  onClick={() => {
                    setfillterOption(false);
                    fetchData();
                  }}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex={0} // Make it keyboard accessible
                  id="menu-item-0"
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setfillterOption(false);
                    setUserData(PendingData);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex={0} // Make it keyboard accessible
                  id="menu-item-1"
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    setUserData(RejectedData);
                    setfillterOption(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex={0} // Make it keyboard accessible
                  id="menu-item-2"
                >
                  Rejected
                </button>
                <button
                  onClick={() => {
                    setfillterOption(false);
                    setUserData(aproveData);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex={0} // Make it keyboard accessible
                  id="menu-item-3"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="overflow-x-auto  ">
        <table className="w-full text-sm text-left  text-gray-500  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50    ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">Sr No</div>
              </th>
              <th scope="col" className="p-4">
                Student Id
              </th>
              <th scope="col" className="p-4">
                Leavecode
              </th>
              <th scope="col" className="p-4">
                Applay Date
              </th>

              <th scope="col" className="p-4">
                Reason
              </th>
              <th scope="col" className="p-4">
                Status
              </th>
              <th scope="col" className="p-4">
                LeaveDate
              </th>
            </tr>
          </thead>
          <tbody>
            {UserData.slice(currentpageIndex, currentpageIndex + 6).map(
              (items, index) => {
                return (
                  <tr
                    key={items._id}
                    className="border-b   hover:bg-gray-100  "
                  >
                    <td className="p-4 w-4">
                      <div className="flex items-center">{index + 1}</div>
                    </td>
                    <td className="p-4 w-4">
                      <div className="flex items-center">
                        {items.student_id}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap  ">
                      <div className="flex items-center mr-3">
                        {items.leavecode}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded ">
                        {convertdateToNameDatetring(items.applayDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap  ">
                      {items.reason}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium  whitespace-nowrap   text-gray-900  ${
                        items.sanctionedStatus === "Approve"
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      {items.sanctionedStatus}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap  ">
                      {convertdateToNameDatetring(items.LeaveDate)}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap  ">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setactionData(items);
                            setactionModule(true);
                          }}
                          data-drawer-target="drawer-read-product-advanced"
                          data-drawer-show="drawer-read-product-advanced"
                          aria-controls="drawer-read-product-advanced"
                          className="py-2 px-3 flex items-center  gap-2 text-sm font-medium text-center text-gray-900 focus:outline-none bg-blue-500 rounded-lg border border-blue-200 hover:bg-blue-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-blue-200 "
                        >
                          <TbHandClick />
                          Action
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
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700          "
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
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700          "
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
        className={`w-full h-full   absolute justify-center  ${
          actionModule || successModel ? "flex" : "hidden"
        } `}
      >
        {/* {actionModule} */}

        {actionData && (
          <div
            className={`  w-6/12  flex justify-center items-center  ${
              actionModule ? "absolute" : "hidden"
            } `}
          >
            <div class="relative w-full h-auto ">
              <div className="relative p-4 w-full  h-full md:h-auto">
                {/* Modal content */}
                <div className="relative p-4 bg-white rounded-lg shadow   sm:p-5">
                  {/* Modal header */}
                  <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5  ">
                    <h3 className="text-lg font-semibold text-gray-900  ">
                      Update Application
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
                      data-modal-toggle="updateProductModal"
                      onClick={() => {
                        setactionModule(false);
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                      {actionData &&
                        Object.entries(actionData).map(
                          ([key, value], index) => (
                            <h5
                              key={index}
                              className="mb-1 text-sm font-medium text-gray-900  "
                            >
                              {key} : {value}
                            </h5>
                          )
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          setleaveId(actionData._id);
                          setleavecode(actionData.leavecode);
                          setstudent_id(actionData.student_id);
                          setstatus("Approve");
                          setAproveModule(true);
                        }}
                        type="button"
                        data-drawer-target="drawer-update-product"
                        data-drawer-show="drawer-update-product"
                        aria-controls="drawer-update-product"
                        className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-primary-300      "
                      >
                        <FaCheck size={12} />
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setleaveId(actionData._id);
                          setleavecode(actionData.leavecode);
                          setstudent_id(actionData.student_id);
                          setstatus("Rejected");
                          setdeleteView(true);
                        }}
                        type="button"
                        data-modal-target="delete-modal"
                        data-modal-toggle="delete-modal"
                        className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center      "
                      >
                        <TiCancel size={20} />
                        <h1>Reject</h1>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Reject module */}
            <div
              className={`  w-6/12  flex justify-center items-center  ${
                deleteView ? "absolute" : "hidden"
              } `}
            >
              <div class="relative w-full h-auto ">
                <div class="relative bg-white  rounded-lg shadow-2xl  ">
                  <button
                    onClick={() => {
                      setdeleteView(false);
                    }}
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center   "
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
                    <h3 class="mb-5 text-lg font-normal text-gray-500  ">
                      Are you sure you want to Reject this Leave?
                    </h3>
                    <div className="w-full flex justify-center items-center gap-8 ">
                      <button
                        onClick={() => {
                          UpdateData();
                        }}
                        data-modal-toggle="delete-modal"
                        type="button"
                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        onClick={() => {
                          setdeleteView(false);
                        }}
                        data-modal-toggle="delete-modal"
                        type="button"
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10         "
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Aprove module */}
            <div
              className={`  w-6/12  flex justify-center items-center  ${
                AproveModule ? "absolute" : "hidden"
              } `}
            >
              <div class="relative w-full h-auto ">
                <div class="relative bg-white  rounded-lg shadow-2xl  ">
                  <button
                    onClick={() => {
                      setAproveModule(false);
                    }}
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center   "
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
                    <h3 class="mb-5 text-lg font-normal text-gray-500  ">
                      Are you sure you want to Aprove this Leave?
                    </h3>
                    <div className="w-full flex justify-center items-center gap-8 ">
                      <button
                        onClick={() => {
                          UpdateData();
                        }}
                        data-modal-toggle="delete-modal"
                        type="button"
                        class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        onClick={() => {
                          setAproveModule(false);
                        }}
                        data-modal-toggle="delete-modal"
                        type="button"
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10         "
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* sucess module */}
        <div
          className={`  w-4/12  flex justify-center items-center  ${
            successModel ? "absolute" : "hidden"
          } `}
        >
          <div class="relative w-full h-auto ">
            <div class="relative bg-white py-10 rounded-lg shadow-2xl   flex justify-center items-center flex-col">
              <button
                type="button"
                onClick={() => {
                  setsuccessMessege("");
                  setsuccessModel(false);
                }}
                class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center    "
                data-modal-toggle="successModal"
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="w-12 h-12 rounded-full bg-green-100  p-2 flex items-center justify-center mx-auto mb-3.5">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 text-green-500 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <p class="mb-4 text-lg font-semibold text-gray-900  ">
                {successMessege ? successMessege : "Done "}
              </p>
              <button
                data-modal-toggle="successModal"
                type="button"
                onClick={() => {
                  setsuccessMessege("");
                  setsuccessModel(false);
                }}
                class="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
              >
                Continue
              </button>
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

export default Application;
