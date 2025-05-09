// src/pages/addEvent.jsx

import React, { useContext } from "react";
import AddTask from "../Components/AddTask"; // or you might use ToggleableAddTask if that’s your desired flow
import { TaskContext } from "../Components/TaskContext";

const AddEvent = () => {
  const { tasks, updateTasks } = useContext(TaskContext);

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Add Event</h1>
      <AddTask onTempSubmit={(task) => updateTasks([...tasks, task])} />
    </div>
  );
};

export default AddEvent;
