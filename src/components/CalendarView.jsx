import React, { useContext, useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimeAndWeather from "../Components/TimeAndWeather";
import TaskList from "../Components/TaskList"; // Import TaskList for toggling
import "../styles/calendar.css"; // Import the CSS file for styling
import { TaskContext } from "../Components/TaskContext"; // Import TaskContext
import { bulkDelete, downloadTasksAsJSON, importTasksFromJSON } from "../Components/TaskHandlers"; // Import handlers
import { useNavigate, useLocation } from "react-router"; // For navigation and query parameters
import "../styles/index.css"; // Import global styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

export default function CalendarView() {
  const { tasks, updateTasks } = useContext(TaskContext); // Access tasks from TaskContext
  const location = useLocation(); // Get the current location
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const dateParam = queryParams.get("date"); // Get the 'date' parameter from the URL

  const [initialDate, setInitialDate] = useState(
    dateParam || new Date().toISOString().split("T")[0] // Use the 'date' parameter or default to today's date
  );

  const initialView = dateParam ? "timeGridDay" : "dayGridMonth"; // Use "timeGridDay" if navigating to a specific date

  const [showTaskList, setShowTaskList] = useState(false); // State to toggle between views
  const navigate = useNavigate(); // For navigation

  const calendarRef = useRef(null); // Ref for FullCalendar

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize(); // Ensure the calendar resizes properly
    }
  }, []);

  // Map tasks to FullCalendar events
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.favorite ? `❤️ ${task.title}` : task.title, // Add heart icon if favorite
    date: task.dateTime || task.deadline, // Use dateTime or deadline for the event date
    extendedProps: {
      description: task.description,
      deadline: task.deadline,
      category: task.category,
      type: task.type,
      favorite: task.favorite || false, // Add a favorite property (default to false)
      image: task.image || null, // Add an image property (default to null)
    },
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
    console.log("Clicked date and time:", info.date); // Log the clicked date and time
    console.log("Current view type:", info.view.type); // Log the current view type

    const confirmAddTask = window.confirm(
      `You clicked on ${info.dateStr}.\nDo you want to add a task?`
    );

    if (confirmAddTask) {
      let dateTime;

      if (info.view.type === "dayGridMonth") {
        // Month view: Use the current time and clicked date
        const now = new Date(); // Get the current date and time
        const localTime = now.toTimeString().split(" ")[0].slice(0, 5); // Get local time in HH:mm format
        dateTime = `${info.dateStr}T${localTime}`; // Combine selected date with local time
      } else if (info.view.type === "timeGridWeek" || info.view.type === "timeGridDay") {
        // Week or Day view: Use the clicked time and date in local time
        const localDateTime = new Date(info.date).toLocaleString("sv-SE", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          hour12: false,
        });
        dateTime = localDateTime.replace(" ", "T"); // Convert to ISO-like format
      }

      console.log("Passing dateTime to AddTask:", dateTime); // Log the dateTime being passed
      navigate("/add", { state: { dateTime } }); // Pass the date and time as state
    }
  };

  // Handle clicking on an existing event
  const handleEventClick = (info) => {
    const taskId = info.event.id;
    const action = prompt(
      `You clicked on "${info.event.title}".\nChoose an action:\n1: Edit Task (default)\n2: Delete Task\n3: Bulk Delete\n4: Add as Favorite\n5: Remove Favorite\n6: Add Image to Tooltip\n7: Remove Image from Tooltip`
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
    } else if (action === "4") {
      // Add as Favorite
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, favorite: true } : task
      );
      updateTasks(updatedTasks); // Update TaskContext and save to local storage
    } else if (action === "5") {
      // Remove Favorite
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, favorite: false } : task
      );
      updateTasks(updatedTasks); // Update TaskContext and save to local storage
    } else if (action === "6") {
      // Add Image to Tooltip
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*"; // Accept only image files
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const updatedTasks = tasks.map((task) =>
              task.id === taskId
                ? { ...task, image: reader.result } // Add the image URL to the task
                : task
            );
            updateTasks(updatedTasks); // Update TaskContext and save to local storage
          };
          reader.readAsDataURL(file); // Convert the image to a base64 URL
        }
      };
      input.click();
    } else if (action === "7") {
      // Remove Image from Tooltip
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, image: null } : task // Remove the image by setting it to null
      );
      updateTasks(updatedTasks); // Update TaskContext and save to local storage
    }
  };

  // Toggle favorite status of a task
  const toggleFavorite = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, favorite: !task.favorite } : task
    );
    updateTasks(updatedTasks); // Update TaskContext and save to local storage
  };

  // New States for Tooltip
  const [hoveredTask, setHoveredTask] = useState(null); // State to store the hovered task
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State to store tooltip position

  // States for upload and download hover effects
  const [isUploadHovered, setIsUploadHovered] = useState(false); // State for upload hover
  const [isDownloadHovered, setIsDownloadHovered] = useState(false); // State for download hover

  // Handle hovering over a task
  const handleEventMouseEnter = (info) => {
    const task = {
      title: info.event.title,
      description: info.event.extendedProps.description,
      dateTime: info.event.start.toISOString().replace("T", " ").slice(0, 16),
      deadline: info.event.extendedProps.deadline,
      category: info.event.extendedProps.category,
      type: info.event.extendedProps.type,
      image: info.event.extendedProps.image, // Include image in the tooltip
    };

    const eventBounds = info.el.getBoundingClientRect(); // Get the bounding box of the hovered task
    const calendarBounds = document.querySelector(".calendar-container").getBoundingClientRect();

    // Calculate tooltip position relative to the calendar container
    let tooltipX = eventBounds.left - calendarBounds.left + eventBounds.width / 2; // Center horizontally within the calendar
    let tooltipY = eventBounds.bottom - calendarBounds.top + 10; // Position below the task

    const tooltipWidth = 200; // Assume a fixed width for the tooltip
    const tooltipHeight = 150; // Assume a fixed height for the tooltip

    // Ensure the tooltip doesn't overflow the right edge of the calendar
    if (tooltipX + tooltipWidth / 2 > calendarBounds.width) {
      tooltipX = calendarBounds.width - tooltipWidth / 2 - 100; // Adjust to prevent overflow on the right
    }

    // Ensure the tooltip doesn't overflow the left edge of the calendar
    if (tooltipX - tooltipWidth / 2 < 0) {
      tooltipX = tooltipWidth / 2 + 10; // Adjust to prevent overflow on the left
    }

    // Ensure the tooltip doesn't overflow the bottom edge of the calendar
    if (tooltipY + tooltipHeight > calendarBounds.height - 10) {
      if (task.image) {
        tooltipY = eventBounds.top - 200 - calendarBounds.top - tooltipHeight; // Position above the task if it has an image
      } else {
        tooltipY = eventBounds.top - 50 - calendarBounds.top - tooltipHeight; // Position above the task otherwise
      }
    }

    // Ensure the tooltip doesn't overflow the top edge of the calendar
    if (tooltipY < 0) {
      tooltipY = 10; // Adjust to prevent overflow on the top
    }

    setHoveredTask(task); // Set the hovered task
    setTooltipPosition({ x: tooltipX, y: tooltipY }); // Set the tooltip position relative to the calendar
  };

  // Handle leaving a task
  const handleEventMouseLeave = () => {
    setHoveredTask(null); // Clear the hovered task
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => importTasksFromJSON(event, updateTasks); // Use importTasksFromJSON
    input.click();
  };

  const handleDownloadClick = () => {
    downloadTasksAsJSON(tasks); // Use downloadTasksAsJSON
  };

  return (
    <div className="calendar-container" style={{ position: "relative" }}>
      <TimeAndWeather />

      {/* Upload and Download Icons */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "15px",
          zIndex: 1000,
        }}
      >
        {/* Upload Icon */}
        <FontAwesomeIcon
          icon={faUpload}
          beat={isUploadHovered}
          size="1x" // Increase the size of the icon
          style={{ cursor: "pointer" }}
          title="Upload Tasks" // Tooltip text for upload
          onMouseEnter={() => setIsUploadHovered(true)}
          onMouseLeave={() => setIsUploadHovered(false)}
          onClick={handleUploadClick}
        />

        {/* Download Icon */}
        <FontAwesomeIcon
          icon={faDownload}
          beat={isDownloadHovered}
          size="1x" // Increase the size of the icon
          style={{ cursor: "pointer" }}
          title="Download Tasks" // Tooltip text for download
          onMouseEnter={() => setIsDownloadHovered(true)}
          onMouseLeave={() => setIsDownloadHovered(false)}
          onClick={handleDownloadClick}
        />
      </div>

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
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={initialView} // Dynamically set the initial view
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
          eventMouseEnter={handleEventMouseEnter} // Handle hovering over a task
          eventMouseLeave={handleEventMouseLeave} // Handle leaving a task
        />
      )}

      {/* Tooltip for Hovered Task */}
      {hoveredTask && (
        <div
          style={{
            color: "black",
            position: "absolute",
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            backgroundColor: "white", // Set a plain white background
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "200px", // Ensure the tooltip doesn't exceed a reasonable width
            wordWrap: "break-word", // Handle long text gracefully
            transform: "translateX(-50%)", // Center the tooltip horizontally
          }}
        >
          <h4 style={{ margin: "0 0 5px 0" }}>{hoveredTask.title}</h4>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Description:</strong> {hoveredTask.description || "N/A"}
          </p>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Date:</strong> {hoveredTask.dateTime || "N/A"}
          </p>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Deadline:</strong> {hoveredTask.deadline || "N/A"}
          </p>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Category:</strong> {hoveredTask.category || "N/A"}
          </p>
          <p style={{ margin: "0" }}>
            <strong>Type:</strong> {hoveredTask.type || "N/A"}
          </p>
          {hoveredTask.image && (
            <img
              src={hoveredTask.image}
              alt="Task"
              style={{
                marginTop: "10px",
                maxWidth: "100%",
                borderRadius: "5px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}