export const DB_NAME="remote_team_collaboration"

export const initialTasks = {
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