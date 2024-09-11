import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/pages/Home";
import SignUp from "../components/form/SignUp";
import Login from "../components/form/Login";
import KanbanBoard from "../components/pages/KanbanBoard";
import { io } from "socket.io-client"; // Import socket.io-client
import TeamChat from "../components/pages/TeamChat";
import Meeting from "../components/pages/Meeting";

const AllRoutes = () => {
  const [socket, setSocket] = useState(null);
  // Initialize with an empty array

  useEffect(() => {
    // Function to fetch initial tasks

    // Establish socket connection
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server on port 8080");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    // Clean up socket connection on component unmount
    return () => {
      newSocket.disconnect();
      console.log("Disconnected from socket server");
    };
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={socket && <KanbanBoard socket={socket} />} />
        <Route path="/team/chat" element={<TeamChat/>}/>
        <Route path="/meeting" element={<Meeting/>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default AllRoutes;
