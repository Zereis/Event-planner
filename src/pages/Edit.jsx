import React, { useContext } from "react";
import { useSearchParams } from "react-router"; // For reading query parameters
import EditTask from "../Components/EditTask";
import { TaskContext } from "../Components/TaskContext";

export default function Edit() {
  const { tasks, updateTasks } = useContext(TaskContext);
  const [searchParams] = useSearchParams(); // Get query parameters
  const taskId = searchParams.get("taskId"); // Get the taskId parameter

  return (
    <div className="page-container">
      <EditTask tasks={tasks} taskId={taskId} onEdit={updateTasks} />
    </div>
  );
}