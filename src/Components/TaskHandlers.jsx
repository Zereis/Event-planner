export const loadTasks = () => {
    const stored = localStorage.getItem("eventPlannerTasks");
    return stored ? JSON.parse(stored) : [];
  };
  
  export const saveTasks = (tasks) => {
    localStorage.setItem("eventPlannerTasks", JSON.stringify(tasks));
  };
  
  export const clearAllTasks = () => {
    localStorage.removeItem("eventPlannerTasks");
    return [];
  };
  
// src/Handlers/TaskHandlers.jsx

export const bulkDelete = (tasks) => {
  const mode = prompt("Delete by: title / date / month / year / id");
  if (!mode) return tasks;

  const input = prompt(`Enter ${mode}:`);
  if (!input) return tasks;

  let filteredTasks;

  switch (mode.toLowerCase()) {
    case "title":
      filteredTasks = tasks.filter((t) => t.title !== input);
      break;
    case "id":
      filteredTasks = tasks.filter((t) => t.id !== input);
      break;
    case "date":
      filteredTasks = tasks.filter((t) => !t.dateTime.startsWith(input));
      break;
    case "month":
      filteredTasks = tasks.filter((t) => {
        const taskMonth = t.dateTime.slice(0, 7);
        // Check if taskMonth ends with the month (e.g., "-03"), or exactly equal to input
        return !taskMonth.endsWith(`-${input.padStart(2, "0")}`) && taskMonth !== input;
      });
      break;
    case "year":
      filteredTasks = tasks.filter((t) => !t.dateTime.startsWith(input));
      break;
    default:
      alert("Invalid option");
      return tasks;
  }

  const confirmed = confirm(`Are you sure you want to delete tasks by ${mode}: ${input}?`);
  return confirmed ? filteredTasks : tasks;
};

  
  export const downloadTasksAsJSON = (tasks) => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  export const importTasksFromJSON = (event, setTasks) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedTasks = JSON.parse(reader.result);
        if (!Array.isArray(importedTasks)) throw new Error();
        setTasks(importedTasks);
        saveTasks(importedTasks);
      } catch {
        alert("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };
  