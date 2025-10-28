import React, { useEffect, useState, useCallback } from "react";
import TaskColumn from "./TaskColumn";
import "./MainContent.css";

function MainContent({ selectedProjectId, token }) {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });

  // ✅ Fetch tasks function (reusable by TaskColumn)
  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) return;

    try {
      const res = await fetch(
        `http://localhost:2300/Home/Task/${selectedProjectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();

      // Normalize and group by status
      const grouped = {
        todo: data.filter((t) => t.status.toLowerCase() === "to-do"),
        inProgress: data.filter((t) => t.status.toLowerCase() === "in-progress"),
        completed: data.filter((t) => t.status.toLowerCase() === "completed"),
      };

      setTasks(grouped);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [selectedProjectId, token]);

  // ✅ Fetch tasks when project or token changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="main">
      <div className="main--header">
        <h2>Project Tasks</h2>
      </div>
      <div className="main--progress">
        <TaskColumn
          status="To Do"
          task={tasks.todo}
          projectId={selectedProjectId}
          token={token}
          onTaskAdded={fetchTasks}
        />
        <TaskColumn
          status="In Progress"
          task={tasks.inProgress}
          projectId={selectedProjectId}
          token={token}
          onTaskAdded={fetchTasks}
        />
        <TaskColumn
          status="Completed"
          task={tasks.completed}
          projectId={selectedProjectId}
          token={token}
          onTaskAdded={fetchTasks}
        />
      </div>
    </div>
  );
}

export default MainContent;
