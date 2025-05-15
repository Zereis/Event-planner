import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskContext"; // Import TaskContext
import FormActionsDropdown from "./FormActionsDropdown"; // Import FormActionsDropdown
import "../styles/index.css";
import "../styles/addedit-task.css"; // Import your CSS file

function AddTask({ onTempSubmit, dateTime: initialDateTime = "", onClose }) {
  const { latestTask } = useContext(TaskContext); // Access the latest task from context
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(initialDateTime);
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Chore");
  const [type, setType] = useState("Daily");
  const [noDeadline, setNoDeadline] = useState(false);

  useEffect(() => {
    if (initialDateTime) {
      setDateTime(initialDateTime);
    }
  }, [initialDateTime]);

  const generateId = () => Date.now().toString();

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDateTime(initialDateTime);
    setDeadline("");
    setNoDeadline(false);
    setCategory("Chore");
    setType("Daily");
  };

  const reuseLastTask = () => {
    if (latestTask) {
      setTitle(latestTask.title);
      setDescription(latestTask.description);
      setDateTime(latestTask.dateTime);
      setDeadline(latestTask.deadline);
      setCategory(latestTask.category);
      setType(latestTask.type);
      setNoDeadline(latestTask.deadline === "No deadline");
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

    alert("Task added successfully!");
    onTempSubmit(task); // Pass the task data up to the parent component
    setLastTask(task); // Save the task as the last task for reuse


    clearForm(); // Clear the form but keep the popup open
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Task</h2>
      <input
        className="input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />   
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
      />
      <br />
      <textarea
        className="textarea"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <label>
        <input
          type="checkbox"
          checked={noDeadline}
          onChange={(e) => setNoDeadline(e.target.checked)}
        />
      <>No Deadline  </>
      </label>

      {!noDeadline && (
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      )}
      <br />

      <div className="select-container">
        <label>
          <div className="custom-select">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Chore</option>
            <option>Sport</option>
            <option>Music</option>
            <option>Social</option>
            <option>Visual</option>
            <option>Adventure</option>
          </select>
          </div>
        </label>

        <label>
          <div className="custom-select">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Daily</option>
            <option>Fun</option>
            <option>Bucket</option>
          </select>
          </div>
        </label>
      </div>


      <FormActionsDropdown onClear={clearForm} onReuse={reuseLastTask} />
      <div className="right-bottom">
        <button className="button" type="submit">
         Add Task
        </button>
      </div>
    </form>
  );
}

export default AddTask;