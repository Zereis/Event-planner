// src/pages/Home.jsx
import React, { useContext } from "react";
import TaskList from "../Components/TaskList";
import GlobalActionsDropdown from "../Components/GlobalActionsDropdown";
import TimeAndWeather from "../Components/TimeAndWeather";
import Navigation from "../Components/Navigation";
import { TaskContext } from "../Components/TaskContext";
import {
  clearAllTasks,
  bulkDelete,
  downloadTasksAsJSON,
  importTasksFromJSON,
} from "../Components/TaskHandlers";

const Home = () => {
  const { tasks, updateTasks } = useContext(TaskContext);

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🗓️ Event Planner</h1>
      
      <TimeAndWeather />

      <Navigation />

      <GlobalActionsDropdown
        onClearAll={() => updateTasks(clearAllTasks())}
        onBulkDelete={() => {
          const updated = bulkDelete(tasks);
          updateTasks(updated);
        }}
        onExport={() => downloadTasksAsJSON(tasks)}
        onImport={(e) => importTasksFromJSON(e, updateTasks)}
      />

      <TaskList tasks={tasks} />
    </div>
  );
};

export default Home;
