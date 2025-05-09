import { TaskProvider } from "./Components/TaskContext";
import AddEvent from "./pages/addEvent";
import EditEvent from "./pages/editEvent";
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import './styles/app.css'
import NavBar from './components/NavBar'
import Spin from './components/Spin'
import Calendar from './components/CalendarView'

// Placeholder components for routes
const Create = () => <div>Create a Bubble Page</div>;
const Random = () => <div>Random Page</div>;
const Today = () => <div>Today Page</div>;
const NoPages = () => <div>404 Error</div>



function App() {
  return (

    <div className="app-wrapper">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/create" element={<Create />} />
        <Route path="/random" element={<Random />} />
        <Route path="/today" element={<Today />} />
        <Route path="/spin" element={<Spin />} />
        <Route path="*" element={<NoPages />} />
      </Routes>
    </div>
  );
}

export default App;