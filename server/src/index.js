import dotenv from "dotenv";
import mongodbConnection from "./db/index.js";
import app from "./app.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Create an HTTP server with the Express app
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // Ensure the client can connect from any origin (adjust as needed for production)
  },
});

// Load environment variables from .env file
dotenv.config({
  path: ".env",
});

// Use port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// Initial task data
let initialTasks = {
  todo: {
    title: "To Do",
    color: "bg-red-400",
    tasks: [
      {
        status: "todo",
        id: "1",
        content: "Design the homepage",
        assignedTo: "John Doe",
        comments: ["Add navigation bar", "Discuss layout options"],
      },
      {
        status: "todo",
        id: "2",
        content: "Fix bug #234",
        assignedTo: "Jane Doe",
        comments: [],
      },
    ],
  },
  inProgress: {
    title: "In Progress",
    color: "bg-yellow-400",
    tasks: [
      {
        status: "inProcess",
        id: "3",
        content: "Implement authentication",
        assignedTo: "Mark",
        comments: ["Add JWT", "Test error handling"],
      },
    ],
  },
  done: {
    title: "Done",
    color: "bg-green-400",
    tasks: [
      {
        status: "done",
        id: "45",
        content: "Set up project repository",
        assignedTo: "Alex",
        comments: ["Share repo link", "Add readme file"],
      },
      {
        status: "done",
        id: "42",
        content: "Set up project repository",
        assignedTo: "Alex",
        comments: ["Share repo link", "Add readme file"],
      },
      {
        status: "done",
        id: "40",
        content: "Set up project repository",
        assignedTo: "Alex",
        comments: ["Share repo link", "Add readme file"],
      },
    ],
  },
};

// HTTP GET route to serve initial tasks
app.get("/task", (req, res) => {
  res.status(200).json(initialTasks);
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  // Send initial tasks to the newly connected client
  socket.emit("initialTasks", initialTasks);

  // Handle the taskMoved event
  socket.on("taskMoved", ({ source, destination, task }) => {
    console.log(`Task moved from ${source.droppableId} to ${destination.droppableId}:`, task);

    // Update the initialTasks object
    const sourceColumn = initialTasks[source.droppableId];
    const destinationColumn = initialTasks[destination.droppableId];

    // Remove task from the source column
    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Add task to the destination column
    const destinationTasks = Array.from(destinationColumn.tasks);
    destinationTasks.splice(destination.index, 0, movedTask);

    // Update the task data
    initialTasks = {
      ...initialTasks,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: {
        ...destinationColumn,
        tasks: destinationTasks,
      },
    };

    // Emit the updated tasks to all connected clients
    io.emit("tasksUpdated", initialTasks);
  });

  // Handle socket disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Connect to the MongoDB database and start the server
mongodbConnection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api/v1/users`);
    });
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION FAILED", err);
  });
