import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // For navigation back to the calendar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDeleteLeft, faStar, faXmark, faImage, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import the reset icon
import "../styles/index.css";
import "../styles/addedit-task.css"; // Import your CSS file

export default function EditTask({ tasks = [], taskId = null, task = null, onEdit, updateTasks, bulkDelete, onDeleteTask, onToggleFavorite, onRemoveImage, onAddImage }) {
  const [searchValue, setSearchValue] = useState(""); // Search field value
  const [matches, setMatches] = useState([]); // Matching tasks
  const [editFields, setEditFields] = useState(task || {}); // Fields to edit
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    if (taskId && task) {
      setSearchValue(taskId); // Set the search field to the taskId
      setEditFields({ ...task }); // Pre-fill the edit fields with the task details
    }
  }, [taskId, task]);

  useEffect(() => {
    console.log("bulkDelete:", bulkDelete);
    console.log("onDeleteTask:", onDeleteTask);
    console.log("onToggleFavorite:", onToggleFavorite);
    console.log("onRemoveImage:", onRemoveImage);
    console.log("onAddImage:", onAddImage);
  }, [bulkDelete, onDeleteTask, onToggleFavorite, onRemoveImage, onAddImage]);

  const handleSearch = (value = searchValue) => {
    setMatches([]);

    const trimmedValue = value.trim().toLowerCase();
    const results = tasks.filter(
      (t) =>
        t.id.toLowerCase() === trimmedValue || t.title.toLowerCase() === trimmedValue
    );

    if (results.length === 0) {
      alert("No task found.");
      setMatches([]);
      setEditFields({});
    } else if (results.length === 1) {
      setEditFields({ ...results[0] });
      setMatches([]);
    } else {
      setMatches(results);
      setEditFields({});
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setMatches([]);
    setEditFields({});
  };

  const handlePickTask = (task) => {
    setEditFields({ ...task });
    setMatches([]);
  };

  const handleResetFields = () => {
    if (task) {
      setEditFields({ ...task }); // Reset the fields to the original task values
    } else {
      alert("No task to reset!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editFields.id) {
      alert("No task selected to edit.");
      return;
    }

    const updatedTasks = tasks.map((t) =>
      t.id === editFields.id ? editFields : t
    );

    onEdit(updatedTasks);
    alert("Changes were successfully saved!");
    handleClearSearch();
  };

  return (
    <div>
      <h3>Edit Task by ID or Title</h3>
      <input
        placeholder="Enter ID or Title"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button className="button" onClick={() => handleSearch()}>Search</button>
      <button className="button" onClick={handleClearSearch}>Clear Search</button>

      {matches.length > 1 && (
        <div>
          <p>Multiple tasks found. Please choose one:</p>
          <ul>
            {matches.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong> – {task.dateTime}{" "}
                <button onClick={() => handlePickTask(task)}>Edit This</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editFields && editFields.id && (
        <form onSubmit={handleSubmit}>
          <label>
            Task ID:
            <input type="text" value={editFields.id} readOnly />
          </label>
          <br />
          <label>
            <h5>Title:</h5>
            <input
              name="title"
              value={editFields.title || ""}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            <h5>Description:</h5>
            <textarea
              className="textarea"
              name="description"
              value={editFields.description || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Date and Time:
            <input
              name="dateTime"
              type="datetime-local"
              value={editFields.dateTime || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Deadline:
            <input
              name="deadline"
              type="datetime-local"
              value={
                editFields.deadline === "No deadline" ? "" : editFields.deadline || ""
              }
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Category:
            <select
              name="category"
              value={editFields.category || "Chore"}
              onChange={handleChange}
            >
              <option>Chore</option>
              <option>Sport</option>
              <option>Music</option>
              <option>Social</option>
              <option>Visual</option>
              <option>Adventure</option>
            </select>
          </label>
          <br />
          <label>
            Type:
            <select
              name="type"
              value={editFields.type || "Daily"}
              onChange={handleChange}
            >
              <option>Daily</option>
              <option>Fun</option>
              <option>Bucket</option>
            </select>
          </label>
          <br />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="button" type="submit">Save</button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Bulk Delete */}
              <button
                className="icon-button"
                type="button"
                onClick={() => bulkDelete(tasks)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007bff",
                }}
                title="Bulk Delete"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>

              {/* Delete Task */}
              <button
                className="icon-button"
                type="button"
                onClick={() => onDeleteTask(editFields.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007bff",
                }}
                title="Delete Task"
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </button>

              {/* Add to Favorites */}
              <button
                className="icon-button"
                type="button"
                onClick={() => onToggleFavorite(editFields.id, true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007bff",
                }}
                title="Add to Favorites"
              >
                <FontAwesomeIcon icon={faStar} />
              </button>

              {/* Remove from Favorites */}
              <button
                className="icon-button"
                type="button"
                onClick={() => onToggleFavorite(editFields.id, false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007bff",
                }}
                title="Remove from Favorites"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              {/* Remove Image */}
              <button
                className="icon-button"
                type="button"
                onClick={() => onRemoveImage(editFields.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007bff",
                }}
                title="Remove Image"
              >
                <FontAwesomeIcon icon={faEyeSlash} />
              </button>

              {/* Add Image */}
              <button
                className="icon-button"
                type="button"
                onClick={() => onAddImage(editFields.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#007bff",
                }}
                title="Add Image"
              >
                <FontAwesomeIcon icon={faImage} />
              </button>
            </div>
          </div>
        </form>
      )}
      <button
        className="button"
        type="button"
        onClick={() => navigate("/")} // Navigate to the home page
      >
        Return to Home
      </button>
    </div>
  );
}

EditTask.defaultProps = {
  bulkDelete: () => alert("bulkDelete function not provided"),
  onDeleteTask: () => alert("onDeleteTask function not provided"),
  onToggleFavorite: () => alert("onToggleFavorite function not provided"),
  onRemoveImage: () => alert("onRemoveImage function not provided"),
  onAddImage: () => alert("onAddImage function not provided"),
};