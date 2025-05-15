import React, { useState } from "react";

export default function TaskList({ tasks, onTaskDoubleClick }) {
  // Filter state: text, category, and type
  const [filterValue, setFilterValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter tasks by text (title or date), category, and type
  const filteredTasks = tasks.filter((task) => {
    const lowerFilter = filterValue.toLowerCase();
    const titleMatch = task.title.toLowerCase().includes(lowerFilter);
    const dateMatch = task.dateTime
      ? task.dateTime.replace("T", " ").toLowerCase().includes(lowerFilter)
      : false;
    const textFilterMatch = filterValue === "" || titleMatch || dateMatch;

    const categoryMatch =
      categoryFilter === "all" || task.category === categoryFilter;
    const typeMatch = typeFilter === "all" || task.type === typeFilter;

    return textFilterMatch && categoryMatch && typeMatch;
  });

  return (
    <div>
      <h2>📋 Task List</h2>

      {/* Filter controls */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filter by title or date"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{
            marginBottom: "0.5rem",
            padding: "0.5rem",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="all">All Categories</option>
            <option value="Chore">Chore</option>
            <option value="Sport">Sport</option>
            <option value="Music">Music</option>
            <option value="Social">Social</option>
            <option value="Visual">Visual</option>
            <option value="Adventure">Adventure</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="all">All Types</option>
            <option value="Daily">Daily</option>
            <option value="Fun">Fun</option>
            <option value="Bucket">Bucket</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              onDoubleClick={() => onTaskDoubleClick(task)} // Handle double-click
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {/* Task Title */}
              <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                {task.title}
              </div>

              {/* Task Description */}
              <div style={{ margin: "0.5rem 0" }}>{task.description}</div>

              {/* Task Date/Time */}
              <div>
                <strong>Date:</strong>{" "}
                {task.dateTime ? task.dateTime.replace("T", " ") : "N/A"}
              </div>

              {/* Task Deadline */}
              <div>
                <strong>Deadline:</strong>{" "}
                {task.deadline === "No deadline"
                  ? "No Deadline"
                  : task.deadline
                  ? task.deadline.replace("T", " ")
                  : "N/A"}
              </div>

              {/* Task Category */}
              <div>
                <strong>Category:</strong> {task.category}
              </div>

              {/* Task Type */}
              <div>
                <strong>Type:</strong> {task.type}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}