import React from "react";
import Header from "./componets/Header";
import Sidebar from "./componets/Sidebar";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import Application from "./pages/Application";
import Notice from "./pages/Notice";
import Holiday from "./pages/Holiday";
import Notification from "./pages/Notification";
import Message from "./pages/Message";
import Userdetails from "./pages/Userdetails";


import { Route, Routes, useLocation } from "react-router-dom";
const App = () => {
  const location = useLocation();

  return (
    <div className="w-full  flex flex-col     ">
      {location.pathname !== "/login" && location.pathname !== "signup" && (
        <Header />
      )}

      <div className="w-full mt-20 h-full flex fixed ">
        {location.pathname !== "/login" && location.pathname !== "signup" && (
          <div className="w-64   h-full   shadow-xl px-5 ">
            <Sidebar />
          </div>
        )}

        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
          <Route path="/user" Component={User} />
          <Route path="/application" Component={Application} />
          <Route path="/notice" Component={Notice} />
          <Route path="/holiday" Component={Holiday} />
          <Route path="/notification" Component={Notification} />
          <Route path="/message" Component={Message} />
          <Route path="/user/userdetails" Component={Userdetails} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
