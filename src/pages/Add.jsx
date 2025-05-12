import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router"; // Import useSearchParams
import AddTask from "../Components/addtask";
import RepeatPrompt from "../Components/RepeatPrompt"; // Import RepeatPrompt
import { TaskContext } from "../Components/TaskContext";
import { useLocation } from "react-router"; // Import useLocation

export default function Add() {
  const { tasks, updateTasks } = useContext(TaskContext);
  const [showRepeatPrompt, setShowRepeatPrompt] = useState(false); // State to show RepeatPrompt
  const [currentTask, setCurrentTask] = useState(null); // State to hold the current task
  const location = useLocation(); // Get the navigation state
  const dateTime = location.state?.dateTime || ""; // Retrieve the dateTime from state

  const handleTempSubmit = (task) => {
    setCurrentTask(task); // Save the task to state
    setShowRepeatPrompt(true); // Show the RepeatPrompt
  };

  const handleConfirmRepeat = (repeatedTasks) => {
    // Add the repeated tasks to the TaskContext
    updateTasks([...tasks, ...repeatedTasks]);
    setShowRepeatPrompt(false); // Hide the RepeatPrompt
  };

  const handleCancelRepeat = () => {
    // Add only the original task if the user cancels the repeat
    updateTasks([...tasks, currentTask]);
    setShowRepeatPrompt(false); // Hide the RepeatPrompt
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Add Event</h1>
      {!showRepeatPrompt ? (
        <AddTask onTempSubmit={handleTempSubmit} initialDateTime={dateTime} /> 
      ) : (
        <RepeatPrompt
          task={currentTask}
          onConfirm={handleConfirmRepeat}
          onCancel={handleCancelRepeat}
        />
      )}
    </div>
  );
}