// filepath: c:\Users\David\Desktop\Event-planner\src\App.jsx
import { Routes, Route } from 'react-router';
import { TaskProvider } from './components/TaskContext'; // Import TaskProvider
import Home from './pages/Home';
import './styles/app.css'

import Spin from './components/Spin'
import Calendar from './components/CalendarView'
import Today from './pages/Today'
import NoPages from './pages/NoPages'
import Header from './components/Header'
import Login from './pages/Login'
import About from './pages/About'

function App() {
  return (   
    <TaskProvider> {/* Wrap the entire app with TaskProvider */}
    <div className="app-wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/about" element={<About />} />
        <Route path="/today" element={<Today />} />
        <Route path="/spin" element={<Spin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NoPages />} />
      </Routes>
    </div>
    </TaskProvider>
  );
}

export default App;