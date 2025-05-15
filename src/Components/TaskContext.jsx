// src/contexts/TaskContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { loadTasks, saveTasks } from "./TaskHandlers";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [latestTask, setLatestTask] = useState(null); // Store the latest task

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    saveTasks(newTasks);
    if (newTasks.length > 0) {
      setLatestTask(newTasks[newTasks.length - 1]); // Update the latest task
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTasks, latestTask }}>
      {children}
    </TaskContext.Provider>
  );
};
