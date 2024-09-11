import React, { useState, useRef, useEffect } from "react";
import { MdDashboard, MdOutlineGroup, MdVideoCall } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  // Load initial values from localStorage if available
  const initialWidth = localStorage.getItem("sidebarWidth")
    ? parseInt(localStorage.getItem("sidebarWidth"))
    : 250;
  const initialTab = localStorage.getItem("activeTab") || "DASHBOARD";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const isResizing = useRef(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle tab clicks and save the active tab to localStorage
  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); // Save tab to localStorage
    navigate(path); // Navigate to the corresponding path
  };

  // Conditionally set active styles
  const getTabClass = (tab) =>
    tab === activeTab
      ? "flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-200"
      : "flex items-center gap-3 p-3 bg-gray-100 text-gray-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer";

  // Handle mouse down event for resizing
  const handleMouseDown = () => {
    isResizing.current = true;
  };

  // Handle mouse move event for resizing and save the new width to localStorage
  const handleMouseMove = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX; // Update width based on mouse position
      if (newWidth > 150 && newWidth < 500) { // Limit the width between 150px and 500px
        setSidebarWidth(newWidth);
        localStorage.setItem("sidebarWidth", newWidth); // Save width to localStorage
      }
    }
  };

  // Stop resizing when mouse is released
  const handleMouseUp = () => {
    isResizing.current = false;
  };

  // Add event listeners for mouse move and mouse up globally
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className="bg-white border shadow-lg h-full"
        style={{ width: sidebarWidth }} // Dynamic width
      >
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div
              className={getTabClass("DASHBOARD")}
              onClick={() => handleTabClick("DASHBOARD", "/")}
            >
              <MdDashboard className="text-xl" />
              <span className="text-lg font-semibold">Dashboard</span>
            </div>
            <div
              className={getTabClass("TEAM CHAT")}
              onClick={() => handleTabClick("TEAM CHAT", "/team/chat")}
            >
              <MdOutlineGroup className="text-xl" />
              <span className="text-lg font-semibold">Team Chat</span>
            </div>
            <div
              className={getTabClass("SCHEDULE")}
              onClick={() => handleTabClick("SCHEDULE", "/meeting")}
            >
              <MdVideoCall className="text-xl" />
              <span className="text-lg font-semibold">Schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resizable handle */}
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-gray-300 cursor-col-resize"
        style={{ cursor: "col-resize" }}
      />
    </div>
  );
};

export default Sidebar;
