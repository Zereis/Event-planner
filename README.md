# 🗓️ Event Planner

**Event Planner** is a feature-rich React application designed to help users efficiently manage tasks, events, and schedules. It features a sleek interface, an interactive calendar, and powerful task management tools—perfect for organizing your daily, weekly, or long-term activities.

---

## 🚀 Features

### 📅 Calendar
- **Interactive Views**: Switch between month, week, and day.
- **Add/Edit Tasks**: Click on a date or time slot to add/edit tasks.
- **Hover Tooltips**: View details by hovering over tasks.
- **Favorites**: Mark tasks as favorites for quick access.
- **Responsive Design**: Calendar adapts to different screen sizes.

### 📝 Task Management
- **Add/Edit Tasks**: Create and update tasks with title, description, deadline, category, and type.
- **Search Tasks**: Find tasks by ID or title.
- **Repeat Tasks**: Set tasks to repeat daily, monthly, or yearly.
- **Task List**: Filterable and searchable list of all tasks.
- **Bulk Actions**: Delete tasks by title, date, month, or year.

### 🌦️ Time & Weather
- **Live Clock**: Displays current local time.
- **Weather Updates**: Real-time weather via wttr.in.

### 🎲 Spin Planner
- **Random Task Selector**: Let the app pick a task for you.
- **Custom Categories**: Select tasks from "Fun", "Bucket List", "Chores", etc.
- **Interactive Wheel**: Spin a fun animated wheel with sound effects.

### ⚙️ Utilities
- **Form Actions**: Clear task forms or reuse the last task input.
- **Global Actions**: Export/Import tasks as JSON, or clear all data.
- **Dark Mode**: Toggle between light and dark themes.

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Framer Motion  
- **State Management**: Context API  
- **Styling**: CSS with custom animations  
- **Data Storage**: LocalStorage  
- **APIs**: [wttr.in](https://wttr.in) for weather (no key required)

---

## 📂 Project Structure

<pre>
src/
├── Components/
│   ├── AddTask.jsx
│   ├── CalendarView.jsx
│   ├── EditTask.jsx
│   ├── FormActionsDropdown.jsx
│   ├── GlobalActionsDropdown.jsx
│   ├── Header.jsx
│   ├── NavBar.jsx
│   ├── NavBubble.jsx
│   ├── BubbleButton.jsx
│   ├── TaskContext.jsx
│   ├── TaskHandlers.jsx
│   ├── TaskList.jsx
│   ├── TimeAndWeather.jsx
│   ├── Spin.jsx
│   ├── SoundManagerSpin.jsx
│   ├── RepeatPrompt.jsx
│   └── Toggle.jsx
├── pages/
│   ├── Home.jsx
│   ├── Add.jsx
│   ├── Edit.jsx
│   ├── Today.jsx
│   ├── Spin.jsx
│   └── NoPages.jsx
├── styles/
│   ├── app.css
│   ├── calendar.css
│   ├── header.css
│   ├── navbubble.css
│   ├── toggle.css
│   └── bubbles.css
└── App.jsx
</pre>

---

## 🧩 Key Components

### `CalendarView.jsx`
- Renders an interactive calendar with FullCalendar.
- Handles task creation, editing, and deletion.
- Adjusts responsively to layout changes.

### `AddTask.jsx`
- Form to create new tasks.
- Supports setting deadlines, categories, and types.
- Includes utility options like clear or reuse last input.

### `EditTask.jsx`
- Search and update tasks by ID or title.
- Modify date, time, and other task properties.

### `Spin.jsx`
- Selects a random task using a spinning wheel.
- Adds playful interaction with animation and sound.

---

## 🌟 Task Details

### Categories
- **Chore**: Daily life tasks like cleaning or shopping.
- **Sport**: Activities like running, gym, or yoga.
- **Music**: Practice or events related to music.
- **Social**: Hangouts, parties, or meetings.
- **Visual**: Creative work like drawing or photography.
- **Adventure**: Hiking, travel, and outdoor events.

### Types
- **Daily**: Recurring daily tasks.
- **Fun**: Leisure and entertainment.
- **Bucket**: Long-term goals or dreams.

---

## 🖥️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/event-planner.git
   cd event-planner

2. **npm install**
# or
yarn install

3. **Start the development server**
npm start
# or
yarn start

## 🔧 Configuration
Weather API
Uses wttr.in for weather data.

No API key required.

## 🛡️ Known Issues
Calendar Freezes or Overlaps

Cause: FullCalendar may fail to resize on load.

Fix: Set fixed dimensions and call updateSize() after mounting.

Time Zone Discrepancies

Cause: Tasks may appear in UTC.

Fix: Use toLocaleString() for proper local formatting.

##📜 License 
This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository

Create a new branch

bash
Copy
Edit
git checkout -b feature-name
Commit your changes

Push to your fork

Open a Pull Request

## 📧 Contact
For questions, ideas, or feedback:

Email: your-email@example.com

GitHub: your-username

