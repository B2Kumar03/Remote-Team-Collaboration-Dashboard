import "./App.css";
import React, { useEffect, useState } from "react";

import AllRoutes from "./router/AllRoutes";
import Home from "./components/pages/Home";
import Sidebar from "./components/pages/Sidebar";
import RightSidebar from "./components/pages/RightSidebar";

// import Dropable from "./components/pages/Dropable";

const App = () => {
  return (
    <div className="flex w-[100%] h-screen">
      <Sidebar />
      <div className="w-[70%]">
      <AllRoutes />
      </div>
      <RightSidebar/>
    </div>
  );
};

export default App;
