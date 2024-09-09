import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  PlusCircleIcon,
  ChatAltIcon,
  UserCircleIcon,
} from "@heroicons/react/outline"; // Using Heroicons
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Required for Chart.js

ChartJS.register(ArcElement, Tooltip, Legend); // Register chart elements

// Kanban Board Component
function KanbanBoard({ socket }) {
  const [columns, setColumns] = useState({
    todo: { title: "To Do", tasks: [] },
    inProgress: { title: "In Progress", tasks: [] },
    done: { title: "Done", tasks: [] }
  });
  const [showComments, setShowComments] = useState({});
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    // Fetch initial tasks on component mount
    const fetchInitialTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/task"); // Fetch from your API
        const data = await response.json();
        console.log(data);
        setColumns(data); // Store the fetched tasks in state
      } catch (error) {
        console.error("Error fetching initial tasks:", error);
      }
    };

    fetchInitialTasks(); // Fetch tasks on mount
  }, []);

  useEffect(() => {
    // Listen for tasksUpdated event
    socket.on("tasksUpdated", (updatedTasks) => {
      setColumns(updatedTasks);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off("tasksUpdated");
    };
  }, [socket]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destinationTasks = Array.from(destinationColumn.tasks);
    destinationTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: {
        ...destinationColumn,
        tasks: destinationTasks,
      },
    });

    // Emit the taskMoved event with updated task information
    socket.emit("taskMoved", {
      source: { droppableId: source.droppableId, index: source.index },
      destination: { droppableId: destination.droppableId, index: destination.index },
      task: movedTask,
    });
  };

  const toggleComments = (taskId) => {
    setShowComments((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const toggleGraphView = () => {
    setShowGraph(!showGraph);
  };

  // Calculate task percentages
  const totalTasks =
    columns.todo.tasks.length +
    columns.inProgress.tasks.length +
    columns.done.tasks.length;

  const taskData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [
          (columns.todo.tasks.length / totalTasks) * 100,
          (columns.inProgress.tasks.length / totalTasks) * 100,
          (columns.done.tasks.length / totalTasks) * 100,
        ],
        backgroundColor: ["#f87171", "#fbbf24", "#34d399"],
        hoverBackgroundColor: ["#f87171", "#fbbf24", "#34d399"],
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <button
          onClick={toggleGraphView}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {showGraph ? "Hide Graph View" : "Show Graph View"}
        </button>
      </div>

      {showGraph ? (
        <div className="flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Doughnut data={taskData} />
            <div className="mt-4 text-center">
              <p className="font-semibold">Task Progress Overview</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="flex space-x-4">
            <DragDropContext onDragEnd={onDragEnd}>
              {Object.entries(columns).map(([columnId, column]) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <div
                      className="bg-white rounded-lg p-4 shadow-lg w-96"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{column.title}</h2>
                        <button className="text-primaryBlue">
                          <PlusCircleIcon className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {column.tasks.map((task, taskIndex) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={taskIndex}
                          >
                            {(provided) => (
                              <div
                                className={`p-4 rounded-md shadow-md border border-gray-200 hover:shadow-lg ${column.color}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="font-semibold text-lg">
                                    {task.content}
                                  </h3>
                                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-600">
                                  Assigned to: {task.assignedTo}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <button
                                    className="text-blue-600 flex items-center"
                                    onClick={() => toggleComments(task.id)}
                                  >
                                    <ChatAltIcon className="w-5 h-5 mr-1" />
                                    {showComments[task.id]
                                      ? "Hide Comments"
                                      : "View Comments"}
                                  </button>
                                </div>
                                {showComments[task.id] && (
                                  <div className="mt-2 text-sm text-gray-700">
                                    {task.comments.length > 0 ? (
                                      <ul className="list-disc pl-4">
                                        {task.comments.map((comment, idx) => (
                                          <li key={idx}>{comment}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p>No comments yet.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
