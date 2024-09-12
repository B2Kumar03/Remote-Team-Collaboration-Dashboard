import "./App.css";
import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation

import AllRoutes from "./router/AllRoutes";
import Sidebar from "./components/pages/Sidebar";
import RightSidebar from "./components/pages/RightSidebar";

const App = () => {
  const location = useLocation(); // Get current location (route)

  // Check if the current path is either /signup or /login
  const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

  return (
    <div className="flex w-[100%] h-screen">
      {/* Hide Sidebar and RightSidebar on /signup and /login routes */}
      {!isAuthPage && <Sidebar />}
      <div className={isAuthPage ? "w-[100%]" : "w-[70%]"}>
        <AllRoutes />
      </div>
      {!isAuthPage && <RightSidebar />}
    </div>
  );
};

export default App;
