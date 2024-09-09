import "./App.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import AllRoutes from "./router/AllRoutes";
import KanbanBoard from "./components/pages/KanbanBoard";
import Dropable from "./components/pages/Dropable";

const App = () => {
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
    <div>
      <AllRoutes />
      {/* Pass socket and initial tasks as props to KanbanBoard */}
      {socket && <KanbanBoard socket={socket}  />}
      <Dropable />
    </div>
  );
};

export default App;
