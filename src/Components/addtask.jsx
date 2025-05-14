import { useState } from "react";
import { useNavigate, useLocation } from "react-router"; // For navigation and location
import FormActionsDropdown from "./FormActionsDropdown"; // Import FormActionsDropdown
import '../styles/index.css';
import '../styles/addedit-task.css'; // Import your CSS file

function AddTask({ onTempSubmit }) {
  const location = useLocation(); // Get the location object
  const initialDateTime = location.state?.dateTime || ""; // Access the dateTime from state

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(initialDateTime); // Use initialDateTime if provided
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Chore");
  const [type, setType] = useState("Daily");
  const [noDeadline, setNoDeadline] = useState(false);
  const [lastTask, setLastTask] = useState(null); // Store the last task for reuse
  const navigate = useNavigate(); // For navigation

  const generateId = () => Date.now().toString();

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDateTime(initialDateTime); // Reset to initialDateTime
    setDeadline("");
    setNoDeadline(false);
    setCategory("Chore");
    setType("Daily");
  };

  const reuseLastTask = () => {
    if (lastTask) {
      setTitle(lastTask.title);
      setDescription(lastTask.description);
      setDateTime(lastTask.dateTime);
      setDeadline(lastTask.deadline);
      setCategory(lastTask.category);
      setType(lastTask.type);
      setNoDeadline(lastTask.deadline === "No deadline");
    } else {
      alert("No last task to reuse!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const task = {
      id: generateId(),
      title,
      description,
      dateTime,
      deadline: noDeadline ? "No deadline" : deadline,
      category,
      type,
    };

    // Pass the task data up to the parent component
    onTempSubmit(task);
    setLastTask(task); // Save the task as the last task for reuse

    // Show success message
    alert("Task added successfully!");

    // Clear the form
    clearForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "2px solid #007BFF",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "500px",
        margin: "20px auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>Add Task</h2>
      <input className="input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea className="textarea"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
      />
      <br />

      <label>
        <input
          type="checkbox"
          checked={noDeadline}
          onChange={(e) => setNoDeadline(e.target.checked)}
        />
        No Deadline
      </label>
      <br />
      {!noDeadline && (
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      )}
      <br />

      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Daily</option>
          <option>Fun</option>
          <option>Bucket</option>
        </select>
      </label>
      <br />

      <button className="button" type="submit">➕ Add Task</button>
      <br />

      <button className="button"
        onClick={() => navigate("/")} // Navigate to the home page
      >
        Return to Home
      </button>
      <br />
      {/* Add FormActionsDropdown */}
      <FormActionsDropdown onClear={clearForm} onReuse={reuseLastTask} />
    </form>
  );
}

export default AddTask;