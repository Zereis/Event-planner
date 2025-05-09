// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./Components/TaskContext";
import Home from "./pages/Home";
import AddEvent from "./pages/addEvent";
import EditEvent from "./pages/editEvent";

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEvent />} />
          <Route path="/edit" element={<EditEvent />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
