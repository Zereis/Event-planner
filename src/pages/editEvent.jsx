// src/pages/editEvent.jsx

import React, { useContext } from "react";
import EditTask from "../Components/Edittask";
import { TaskContext } from "../Components/TaskContext";

const EditEvent = () => {
  const { tasks, updateTasks } = useContext(TaskContext);
  
  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Edit Event</h1>
      <EditTask tasks={tasks} onEdit={updateTasks} />
    </div>
  );
};

export default EditEvent;
