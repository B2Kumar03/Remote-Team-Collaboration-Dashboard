const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const PORT = 8080;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Initial tasks
let initialTasks = {
  todo: {
    title: "To Do",
    color: "bg-red-400",
    tasks: [
      {
        id: "1",
        content: "Design the homepage",
        assignedTo: "John Doe",
        comments: ["Add navigation bar", "Discuss layout options"],
      },
      {
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
        id: "45",
        content: "Set up project repository",
        assignedTo: "Alex",
        comments: ["Share repo link", "Add readme file"],
      },
      {
        id: "42",
        content: "Set up project repository",
        assignedTo: "Alex",
        comments: ["Share repo link", "Add readme file"],
      },
      {
        id: "40",
        content: "Set up project repository",
        assignedTo: "Alex",
        comments: ["Share repo link", "Add readme file"],
      },
    ],
  },
};

// Serve initial tasks
app.get("/task", (req, res) => {
  res.status(200).json(initialTasks);
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send initial tasks to the newly connected client
  socket.emit("initialTasks", initialTasks);

  // Handle the taskMoved event
  socket.on("taskMoved", ({ source, destination, task }) => {
    console.log(source,destination,task);
    console.log(`Task moved from ${source} to ${destination}:`, task);

    // Update the initialTasks object
    const sourceColumn = initialTasks[source.droppableId];
    const destinationColumn = initialTasks[destination.droppableId];

    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destinationTasks = Array.from(destinationColumn.tasks);
    destinationTasks.splice(destination.index, 0, movedTask);

    initialTasks = {
      ...initialTasks,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: {
        ...destinationColumn,
        tasks: destinationTasks,
      },
    };

    // Emit the updated tasks to all clients
    io.emit("tasksUpdated", initialTasks);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Define a simple GET route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server on the specified port
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
