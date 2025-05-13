import React, { useContext, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimeAndWeather from "../Components/TimeAndWeather";
import TaskList from "../Components/TaskList"; // Import TaskList for toggling
import "../styles/calendar.css"; // Import the CSS file for styling
import { TaskContext } from "../Components/TaskContext"; // Import TaskContext
import { bulkDelete, downloadTasksAsJSON, importTasksFromJSON } from "../Components/TaskHandlers"; // Import handlers
import { useNavigate } from "react-router"; // For navigation to Add.jsx
import "../styles/index.css"; // Import global styles

export default function CalendarView() {
  const { tasks, updateTasks } = useContext(TaskContext); // Access tasks from TaskContext
  const [showTaskList, setShowTaskList] = useState(false); // State to toggle between views
  const [initialDate, setInitialDate] = useState(new Date().toISOString().split("T")[0]); // State to control the calendar's initial date
  const navigate = useNavigate(); // For navigation

  // Map tasks to FullCalendar events
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    date: task.dateTime || task.deadline, // Use dateTime or deadline for the event date
  }));

  // Handle double-clicking on a task in TaskList
  const handleTaskDoubleClick = (task) => {
    setShowTaskList(false); // Toggle back to the calendar view

    // Navigate to the task's date
    const taskDate = task.dateTime || task.deadline;

    if (taskDate) {
      console.log("Navigating to task date:", taskDate); // Debugging log
      setInitialDate(taskDate); // Update the calendar's initial date
    } else {
      alert("This task does not have a valid date.");
    }
  };

  // Handle clicking on an empty date
  const handleDateClick = (info) => {
  const action = prompt(
    `You clicked on ${info.dateStr}.\nChoose an action:\n1: Add Task (default)\n2: Upload JSON file\n3: Download JSON file`
  );

  if (action === null) {
    // User clicked "Cancel", do nothing
    return;
  }

  if (action === "2") {
    // Upload JSON file
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => importTasksFromJSON(event, updateTasks); // Use importTasksFromJSON
    input.click();
  } else if (action === "3") {
    // Download JSON file
    downloadTasksAsJSON(tasks); // Use downloadTasksAsJSON
  } else {
    // Default action: Add Task
    const now = new Date(); // Get the current date and time
    const localTime = now.toTimeString().split(" ")[0].slice(0, 5); // Get local time in HH:mm format
    const dateTime = `${info.dateStr}T${localTime}`; // Combine selected date with local time
    navigate("/add", { state: { dateTime } }); // Pass the date and time as state
  }
};

  // Handle clicking on an existing event
  const handleEventClick = (info) => {
    const taskId = info.event.id;
    const action = prompt(
      `You clicked on "${info.event.title}".\nChoose an action:\n1: Edit Task (default)\n2: Delete Task\n3: Bulk Delete`
    );

    if (action === null) {
      // User clicked "Cancel", do nothing
      return;
    }

    if (action === "1" || action === "") {
      // Default or Edit Task
      navigate(`/edit?taskId=${taskId}`); // Navigate to Edit.jsx with taskId
    } else if (action === "2") {
      const confirmed = window.confirm(
        `Are you sure you want to delete the task "${info.event.title}"?`
      );
      if (confirmed) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        updateTasks(updatedTasks); // Update TaskContext and save to local storage
      }
    } else if (action === "3") {
      const updatedTasks = bulkDelete(tasks); // Use bulkDelete from TaskHandlers
      updateTasks(updatedTasks); // Update TaskContext and save to local storage
    }
  };

  return (
    <div className="calendar-container">
      <TimeAndWeather />

      {/* Toggle Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button className="button"
          onClick={() => setShowTaskList((prev) => !prev)}
        >
          {showTaskList ? "Show Calendar" : "Show Task List"}
        </button>
      </div>

      {/* Conditionally Render Calendar or Task List */}
      {showTaskList ? (
        <TaskList tasks={tasks} onTaskDoubleClick={handleTaskDoubleClick} /> // Pass the double-click handler to TaskList
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={initialDate} // Use the state-controlled initial date
          events={events} // Pass the mapped events
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          dateClick={handleDateClick} // Handle clicking on an empty date
          eventClick={handleEventClick} // Handle clicking on an existing event
        />
      )}
    </div>
  );
}