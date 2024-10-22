import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SideNav from "./Componets/SideNav";
import AllUserPage from "../src/Pages/AllUserPage";
import InfoPage from "../src/Pages/InfoPage";
import Header from "../src/Componets/Header";
import Login from "../src/Pages/Login";
import Signup from "../src/Pages/SingnUp";
import SingnUp from "../src/Pages/SingnUp";
import Contact from "./Pages/Contact";
function App() {
  return (
    <div className="w-full  flex flex-col     ">
      <Header />
      <div className="w-full mt-20 h-full flex fixed ">
        <div className="w-80   h-full   shadow-xl px-5 ">
          <SideNav />
        </div>

        <section className=" w-full overflow-scroll justify-end  relative  h-full  p-3 sm:p-5   ">
          <Routes>
            <Route path="/" Component={InfoPage} />
            <Route path="/login" Component={Login} />
            <Route path="/signup" Component={SingnUp} />
            <Route path="/user" Component={AllUserPage} />
            <Route path="/contact" Component={Contact} />
          </Routes>
        </section>
      </div>
    </div>
  );
}

export default App;
