import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loader from "../componets/Loader";
import { FaUsersViewfinder } from "react-icons/fa6";
import { HiOutlineUserAdd } from "react-icons/hi";
import Example from "../componets/Charts/Example";
import Example2 from "../componets/Charts/Example2";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [Totalusers, setTotalusers] = useState(null);
  const [NewUsers, setNewUsers] = useState(null);
  const [userPerMonth, setuserPerMonth] = useState([]);

  const [leaveIn, setleaveIn] = useState(0);
  const [leaveOut, setleaveOut] = useState(0);
  const [leave, setleave] = useState(0);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${process.env.REACT_APP_BASE_URL}/admin/totaluserinfo`;
        const response = await fetch(url, {
          method: "get",
          "content-type": "application/json",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.message);
        }

        const userdata = await response.json();

        setTotalusers(userdata.totaluser);
        setNewUsers(userdata.newuserthisMonth);

        if (Array.isArray(userdata.userperMonth)) {
          setuserPerMonth(userdata.userperMonth);
        } else {
          console.warn("userperMonth is not an array:", userdata.userperMonth);
        }
      } catch (error) {
        console.log("error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (Loading) {
    return <Loader />;
  }
  return (
    <div className="w-full h-full flex flex-col  gap-2">
      <div class="w-full px-4 mt-5">
        <div class="-mx-4 flex ">
          <div class="w-full px-4 md:w-1/2 lg:w-1/3 2xl:w-full">
            <div class="relative py-6 gap-6  flex items-center rounded-[10px]  bg-white px-6  shadow-lg ">
              <div className="w-24 h-24 flex items-center justify-center bg-blue-400 rounded-full">
                <HiOutlineUserAdd className="w-12 h-12 text-white" />
              </div>
              <div>
                <p class="text-2xl font-bold text-dark dark:text-white xl:text-[28px] xl:leading-[35px]">
                  {NewUsers}
                </p>
                <p class="mt-1 text-base text-body-color dark:text-dark-6">
                  New Users
                </p>
              </div>
            </div>
          </div>
          <div class="w-full px-4 md:w-1/2 lg:w-1/3 2xl:w-full">
            <div class="relative py-6 gap-6  flex items-center rounded-[10px]  bg-white px-6  shadow-lg ">
              <div className="w-24 h-24 flex items-center justify-center bg-blue-400 rounded-full">
                <FaUsersViewfinder className="w-12 h-12 text-white" />
              </div>
              <div>
                <p class="text-2xl font-bold text-dark dark:text-white xl:text-[28px] xl:leading-[35px]">
                  {Totalusers}
                </p>
                <p class="mt-1 text-base text-body-color dark:text-dark-6">
                  Total Users
                </p>
              </div>
            </div>
          </div>
          {/* <div class="w-full px-4 md:w-1/2 lg:w-1/3 2xl:w-full">
            <div class="relative py-6 gap-6  flex items-center rounded-[10px]  bg-white px-6  shadow-lg ">
              <div className="w-24 h-24 flex items-center justify-center bg-blue-400  rounded-full">
                <RiMoneyEuroCircleLine className="w-12 h-12 text-white" />
              </div>
              <div>
                <p class="text-2xl font-bold text-dark dark:text-white xl:text-[28px] xl:leading-[35px]">
                  $4,350
                </p>
                <p class="mt-1 text-base text-body-color dark:text-dark-6">
                  Earned this month
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="w-full grid grid-cols-5 gap-3  px-4 mt-5">
        <div className="w-full bg-white shadow-xl rounded-md p-2  col-span-3">
          <Example data={userPerMonth} />
        </div>
        <div className="w-full relative   col-span-2 bg-white shadow-xl rounded-md p-2 flex flex-col gap-5 items-center justify-center ">
          <Example2
            leaveIn={leaveIn}
            leaveOut={leaveOut}
            leave={leave}
            Totalusers={Totalusers}
          />
          <h1 className="text-base absolute bottom-0 right-0 px-5 py-4">
            Today working Status
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
