import { useState } from "react";

export default function EditTask({ onEdit, tasks }) {
  const [searchValue, setSearchValue] = useState("");
  const [matches, setMatches] = useState([]);
  const [editFields, setEditFields] = useState(null);

  const handleSearch = () => {
    setMatches([]);

    const value = searchValue.trim().toLowerCase();
    const results = tasks.filter(
      (t) =>
        t.id.toLowerCase() === value || t.title.toLowerCase() === value
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
    alert("Task updated!");
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
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClearSearch}>Clear Search</button>

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
          <input name="title" value={editFields.title || ""} onChange={handleChange} required />
          <input name="description" value={editFields.description || ""} onChange={handleChange} />
          <input name="dateTime" type="datetime-local" value={editFields.dateTime || ""} onChange={handleChange} />
          <input
            name="deadline"
            type="datetime-local"
            value={editFields.deadline === "No deadline" ? "" : editFields.deadline || ""}
            onChange={handleChange}
          />
          <select name="category" value={editFields.category || "Chore"} onChange={handleChange}>
            <option>Chore</option>
            <option>Sport</option>
            <option>Music</option>
            <option>Social</option>
            <option>Visual Art</option>
          </select>
          <select name="type" value={editFields.type || "Daily"} onChange={handleChange}>
            <option>Daily</option>
            <option>Fun</option>
            <option>Bucket</option>
          </select>
          <button type="submit">Update Task</button>
        </form>
      )}
    </div>
  );
}
