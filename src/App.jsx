// filepath: c:\Users\David\Desktop\Event-planner\src\App.jsx
import { Routes, Route } from 'react-router';
import { TaskProvider } from './Components/TaskContext'; // Import TaskProvider
import Home from './pages/Home';
import './styles/app.css';
import NavBar from './components/NavBar';
import Spin from './components/Spin';
import Calendar from './components/CalendarView';
import Edit from './pages/Edit';
import Add from './pages/Add';
import Today from './pages/Today';
import NoPages from './pages/NoPages';

function App() {
  return (
    <TaskProvider> {/* Wrap the entire app with TaskProvider */}
      <div className="app-wrapper">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/today" element={<Today />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="*" element={<NoPages />} />
        </Routes>
      </div>
    </TaskProvider>
  );
}

export default App;