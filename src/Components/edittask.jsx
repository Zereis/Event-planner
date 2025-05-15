import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // For navigation back to the calendar
import '../styles/index.css';
import '../styles/addedit-task.css'; // Import your CSS file

export default function EditTask({ tasks, taskId, onEdit }) {
  const [searchValue, setSearchValue] = useState(""); // Search field value
  const [matches, setMatches] = useState([]); // Matching tasks
  const [editFields, setEditFields] = useState(null); // Fields to edit
  const navigate = useNavigate(); // For navigation

  // Pre-fill the search field with the taskId when the component loads
  useEffect(() => {
    if (taskId) {
      setSearchValue(taskId); // Set the search field to the taskId
      handleSearch(taskId); // Automatically search for the task
    }
  }, [taskId]);

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
      setEditFields(null);
    } else if (results.length === 1) {
      setEditFields({ ...results[0] });
      setMatches([]);
    } else {
      setMatches(results);
      setEditFields(null);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setMatches([]);
    setEditFields(null);
  };

  const handlePickTask = (task) => {
    setEditFields({ ...task });
    setMatches([]);
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
    const updatedTasks = tasks.map((t) =>
      t.id === editFields.id ? editFields : t
    );
    onEdit(updatedTasks);
    alert("Changes were successfully saved!");
    handleClearSearch();
    navigate("/"); // Redirect back to the calendar
  };

  return (
    <div

    >
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

      {editFields && (
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
            <textarea className="textarea"
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
          <button className="button" type="submit">Save</button>
        </form>
      )}
      <br />
      <button className="button"
        type="button"
        onClick={() => navigate("/")} // Navigate to the home page
      >
        Return to Home
      </button>
    </div>
  );
}