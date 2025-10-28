import React, { useState } from "react";
import "./TaskColumn.css";
import logoAdd from "../assets/logo-add.png";
import Card from "./Card.jsx";

function TaskColumn({ status, task = [], projectId, token, onTaskAdded }) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    tag: "",
    dueDate: "",
  });

  const handleAddTask = async () => {
    const { title, description, tag, dueDate } = newTask;

    if (!title || !description || !tag || !dueDate)
      return alert("Please fill in all fields.");

    // ✅ Map display status → backend enum value
    const mappedStatus =
      status === "To Do"
        ? "to-do"
        : status === "In Progress"
        ? "in-progress"
        : "completed";

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:2300/Home/Task/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ Authorization header
        },
        body: JSON.stringify({
          title,
          description,
          tag,
          assignedTo: [],
          status: mappedStatus, // ✅ Correct enum value
          dueDate,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => null);
        throw new Error(errText || "Failed to create task");
      }

      const createdTask = await res.json();

      setIsAdding(false);
      setNewTask({ title: "", description: "", tag: "", dueDate: "" });

      if (onTaskAdded) onTaskAdded(createdTask);
    } catch (err) {
      console.error("Error adding task:", err);
      alert(err.message || "Could not add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="progress">
      <div className="progress--status">
        <h3 className="progress--status--header">{status}</h3>
        <img
          src={logoAdd}
          className="progress--status--addLogo"
          style={{ width: "14px", height: "14px", cursor: "pointer" }}
          alt="Add"
          onClick={() => setIsAdding((prev) => !prev)}
        />
      </div>

      <hr className="divider" />

      {isAdding && (
        <div className="add-task-form" style={{ margin: "10px 20px" }}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="add-task-input"
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="add-task-textarea"
          ></textarea>
          <input
            type="text"
            placeholder="Tag (e.g. frontend)"
            value={newTask.tag}
            onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
            className="add-task-input"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="add-task-input"
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              className="add-task-btn"
              onClick={handleAddTask}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              className="add-task-btn"
              style={{ backgroundColor: "#ddd", color: "#222" }}
              onClick={() => setIsAdding(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="task">
        {task.length === 0 ? (
          <p className="no-task">No tasks yet</p>
        ) : (
          task.map((element, index) => (
            <Card
              key={index}
              tag={element.tag}
              title={element.title}
              description={element.description}
              dueDate={element.dueDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskColumn;
