import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GoStop } from "react-icons/go";
import { FaPlus } from "react-icons/fa";
import { convertdateToNameDatetring } from "../componets/Data";
import DatePicker from "react-datepicker";
import Loader from "../componets/Loader";
import "react-datepicker/dist/react-datepicker.css";
import "./customDatePicker.css";

const Holiday = () => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [Userid, setUserid] = useState(null);

  const [successModel, setsuccessModel] = useState(false);
  const [successMessege, setsuccessMessege] = useState("");
  const [erroMessage, seterroMessage] = useState("");

  const [deleteView, setdeleteView] = useState(false);

  const date = new Date();
  const [addModule, setaddModule] = useState(false);
  const [datePicker, setdatePicker] = useState(date);
  const [name, setname] = useState("");
  const [option, setoption] = useState("No");

  // pagination
  const [currentpageIndex, setcurrentpageIndex] = useState(0);

  useEffect(() => {
    fetchData();
    // This disables the exhaustive-deps rule for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
    // This disables the exhaustive-deps rule for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const url = `${process.env.REACT_APP_BASE_URL}/admin/getholiday`;

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
        setUserData(userdata.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      seterroMessage("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const AddData = async () => {
    try {
      setLoading(true);
      if (name !== "" && option !== "") {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
        }
        const body = {
          name,
          date: datePicker,
          optional: option,
        };
        const url = `${process.env.REACT_APP_BASE_URL}/admin/addholiday`;
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
      setaddModule(false);
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
        const url = `${process.env.REACT_APP_BASE_URL}/admin/deleteholiday`;
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
            <span className="text-gray-500">All Holiday : </span>
            <span className="">{UserData.length}</span>
          </h5>
          <h5 className="text-gray-500  ml-1">
            1 - {parseInt(UserData.length / 6) + 1}
          </h5>
        </div>
        <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3">
          <button
            onClick={() => {
              setaddModule(true);
            }}
            type="button"
            className="flex-shrink-0 inline-flex gap-2 items-center justify-center py-2 px-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200      "
          >
            <FaPlus />
            Add Holiday
          </button>
        </div>
      </div>

      <div className="overflow-x-auto  ">
        <table className="w-full text-sm text-left  text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">SrNo</div>
              </th>
              <th scope="col" className="p-4">
                Name
              </th>
              <th scope="col" className="p-4">
                Date
              </th>

              <th scope="col" className="p-4">
                Optional
              </th>
            </tr>
          </thead>
          <tbody>
            {UserData.slice(currentpageIndex, currentpageIndex + 6).map(
              (items, index) => {
                return (
                  <tr key={items._id} className="border-b  hover:bg-gray-100 ">
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
                        {convertdateToNameDatetring(items.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap ">
                      {items.optional}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap ">
                      <div className="flex items-center space-x-4">
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
        className={`w-full h-full    absolute justify-center items-center ${
          deleteView || addModule || successModel ? "flex" : "hidden"
        } `}
      >
        {/* update module */}
        <div
          className={`  w-4/12 mb-40  flex justify-center items-center  ${
            addModule ? "absolute" : "hidden"
          } `}
        >
          <div className="relative w-full h-auto ">
            <div className="relative bg-white  rounded-lg shadow-2xl ">
              <button
                onClick={() => {
                  setaddModule(false);
                }}
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                data-modal-toggle="delete-modal"
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
              <div className="p-6 w-full flex justify-center items-center flex-col">
                <label htmlFor="" className="w-full px-2  py-2">
                  Holiday Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 outline-none  border-gray-300 border-2 rounded-md"
                  placeholder="enter holiday name "
                  required
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
                <label htmlFor="" className="w-full px-2  py-2">
                  Selecte Date
                </label>
                <div className="w-full flex justify-start ">
                  <DatePicker
                    selected={datePicker}
                    onChange={(date) => setdatePicker(date)}
                    className="custom-date-picker  px-3 py-2 outline-none  border-gray-300 border-2 rounded-md"
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Click to select a date"
                  />
                </div>

                <div className="flex gap-5 my-4 justify-start w-full px-2">
                  <div className="flex  items-center ">
                    <input
                      id="default-radio-1"
                      type="radio"
                      value=""
                      name="default-radio"
                      className="w-4 h-4"
                      onClick={() => {
                        setoption("Yes");
                      }}
                    />
                    <label className="ms-2 text-sm font-medium text-gray-900 ">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      checked
                      id="default-radio-2"
                      type="radio"
                      value=""
                      name="default-radio"
                      className="w-4 h-4"
                      onClick={() => {
                        setoption("No");
                      }}
                    />
                    <label
                      for="default-radio-2"
                      className="ms-2 text-sm font-medium text-gray-900 "
                    >
                      No
                    </label>
                  </div>
                </div>

                <div className="w-full flex justify-start mt-4 items-center gap-3 ">
                  <button
                    data-modal-toggle="delete-modal"
                    type="button"
                    onClick={() => {
                      AddData();
                    }}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Add Holiday
                  </button>
                  <button
                    data-modal-toggle="delete-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10      "
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* delete module */}
        <div
          className={`  w-4/12 mb-20  flex justify-center items-center  ${
            deleteView ? "absolute" : "hidden"
          } `}
        >
          <div className="relative w-full h-auto ">
            <div className="relative bg-white  rounded-lg shadow-2xl ">
              <button
                onClick={() => {
                  setdeleteView(false);
                }}
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                data-modal-toggle="delete-modal"
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
              <div className="p-6 text-center w-full flex justify-center items-center flex-col">
                <GoStop className="w-8 h-8  my-5 text-center" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                  Are you sure you want to delete this product?
                </h3>
                <div className="w-full flex justify-center items-center gap-8 ">
                  <button
                    onClick={() => {
                      deletedata();
                    }}
                    data-modal-toggle="delete-modal"
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    onClick={() => {
                      setdeleteView(false);
                    }}
                    data-modal-toggle="delete-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10      "
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* sucess module */}
        <div
          className={`  w-4/12   flex justify-center items-center  ${
            successModel ? "absolute" : "hidden"
          } `}
        >
          <div className="relative w-full h-auto ">
            <div className="relative bg-white py-10 rounded-lg shadow-2xl  flex justify-center items-center flex-col">
              <button
                type="button"
                onClick={() => {
                  setsuccessMessege("");
                  setsuccessModel(false);
                }}
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                data-modal-toggle="successModal"
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
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="w-12 h-12 rounded-full bg-green-100  p-2 flex items-center justify-center mx-auto mb-3.5">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-green-500 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <p className="mb-4 text-lg font-semibold text-gray-900 ">
                {successMessege ? successMessege : "Done "}
              </p>
              <button
                data-modal-toggle="successModal"
                type="button"
                onClick={() => {
                  setsuccessMessege("");
                  setsuccessModel(false);
                }}
                className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 "
              >
                Done
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

export default Holiday;
