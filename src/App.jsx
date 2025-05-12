import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import './styles/app.css'
import NavBar from './components/NavBar'
import Spin from './components/Spin'
import Calendar from './components/CalendarView'
import Edit from './pages/Edit'
import Add from './pages/Add'
import Today from './pages/Today'
import NoPages from './pages/NoPages'
import Header from './components/Header'

function App() {
  return (

    <div className="app-wrapper">
      <Header />
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
  );
}

export default App;