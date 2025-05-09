// src/contexts/TaskContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { loadTasks, saveTasks } from "./TaskHandlers";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
