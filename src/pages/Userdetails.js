import React, { useEffect, useState } from "react";
import { ContributionCalendar } from "react-contribution-calendar";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { transformAttendanceData } from "../componets/Data"; // Ensure this path is correct
import PieChart from "../componets/Charts/PieChart";
import Loader from "../componets/Loader";
import { convertdateToNameDatetring } from "../componets/Data";
import userimage from "../assets/images/user.png";
const Userdetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(true);
  const [UserData, setUserData] = useState([]);
  const [calendarData, setCalendarData] = useState([]); // State to hold transformed calendar data
  const [erroMessage, setErroMessage] = useState("");
  const [Attandance, setAttandance] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        setErroMessage("No token found, please login.");
        navigate("/login");
        return;
      }

      try {
        const body = {
          student_id: location.state._id,
        };
        const url = `${process.env.REACT_APP_BASE_URL}/admin/userdetails`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErroMessage(errorData.message || "Unauthorized access");
          navigate("/login");
        } else {
          const userdata = await response.json();
          setUserData(userdata.userdata);

          const attandance = userdata.attandance.reduce(
            (initialValue, item) => {
              if (item.Status !== "--") {
                if (initialValue[item.Status]) {
                  initialValue[item.Status] += 1;
                } else {
                  initialValue[item.Status] = 1;
                }
              }

              return initialValue;
            },
            {}
          );

          setAttandance(attandance);

          if (Array.isArray(userdata.timedata)) {
            const calendarData = transformAttendanceData(userdata.timedata);
            setCalendarData(calendarData);
          } else {
            setErroMessage("Unexpected data format.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErroMessage("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (Loading === true) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll pb-40 gap-2">
      <div className="w-full flex gap-5 px-4 mt-5">
        <div className="flex w-8/12 bg-white   shadow-xl rounded-lg">
          <div className="w-full my-auto p-5 py-5 flex flex-col justify-center gap-2">
            <div className="w-full flex sm:flex-row xs:flex-col ">
              <div className="w-4/12  text-gray-900 flex justify-center items-center flex-col">
                <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                  <img
                    className="object-cover object-center h-32"
                    src={UserData[0].profile ? UserData[0].profile : userimage}
                    alt="Woman looking front"
                  />
                </div>
                <div className="text-center mt-2">
                  <h2 className="font-semibold">
                    {UserData[0].username || "N/A"}
                  </h2>
                </div>
              </div>
              <div className="w-8/12 flex  px-4">
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    <div className="flex gap-4 pb-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Name :
                      </dt>
                      <dd className="text-lg font-semibold">
                        {UserData[0].name || "N/A"}
                      </dd>
                    </div>
                    <div className="flex gap-4 pt-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Phone Number :
                      </dt>
                      <dd className="text-lg font-semibold">
                        {UserData[0].phoneno || "N/A"}
                      </dd>
                    </div>
                    <div className="flex gap-4 pt-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Email :
                      </dt>
                      <dd className="text-lg font-semibold">
                        {UserData[0].email || "N/A"}
                      </dd>
                    </div>
                    <div className="flex gap-4 pt-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Create Date :
                      </dt>
                      <dd className="text-lg font-semibold">
                        {UserData[0].createDate
                          ? convertdateToNameDatetring(UserData[0].createDate)
                          : "N/A"}
                      </dd>
                    </div>
                    <div className="flex gap-4 pt-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Update Date :
                      </dt>
                      <dd className="text-lg font-semibold">
                        {UserData[0].updatedDate
                          ? convertdateToNameDatetring(UserData[0].updatedDate)
                          : "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-4/12 justify-center ">
          <div className=" bg-white w-full shadow-xl rounded-lg text-gray-900">
            <PieChart chartdata={Attandance} />
          </div>
        </div>
      </div>
      <div className="w-full flex gap-5 px-4 mt-5">
        <div className="flex w-full h-60">
          <div
            className="light w-full h-auto"
            style={{
              borderRadius: "20px",
              padding: "1rem",
              width: "100%", // Full width
            }}
          >
            {calendarData && (
              <ContributionCalendar
                data={calendarData}
                start="2024-01-01"
                end="2024-12-31"
                daysOfTheWeek={["", "Mon", "", "Wed", "", "Fri", ""]}
                textColor="#000"
                includeBoundary={true}
                startsOnSunday={true}
                cx={18}
                cy={18}
                cr={2}
                theme="grass"
                onCellClick={(_, data) => console.log(data)}
                scroll={false}
                style={{
                  width: "100%",
                  height: "auto",
                  padding: "18px",
                  margin: "0 auto",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {erroMessage && (
        <div className="text-red-400 text-center">{erroMessage}</div>
      )}
    </div>
  );
};

export default Userdetails;
