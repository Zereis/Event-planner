import { useState } from "react";
import FormActionsDropdown from "./FormActionsDropdown";

function AddTask({ onTempSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Chore");
  const [type, setType] = useState("Daily");
  const [noDeadline, setNoDeadline] = useState(false);
  const [lastTask, setLastTask] = useState(null);

  const generateId = () => Date.now().toString();

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDateTime("");
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
      setDeadline(lastTask.deadline === "No deadline" ? "" : lastTask.deadline);
      setNoDeadline(lastTask.deadline === "No deadline");
      setCategory(lastTask.category);
      setType(lastTask.type);
    } else {
      alert("No previous task to reuse.");
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
    setLastTask(task);
    clearForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea
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
          <option>Visual Art</option>
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

      <button type="submit">➕ Add Task</button>{" "}
      <FormActionsDropdown onClear={clearForm} onReuse={reuseLastTask} />
    </form>
  );
}

export default AddTask;
