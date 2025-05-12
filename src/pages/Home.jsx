/*
// src/pages/Home.jsx
import React, { useContext } from "react";
import TaskList from "../Components/TaskList";
import GlobalActionsDropdown from "../Components/GlobalActionsDropdown";
import TimeAndWeather from "../Components/TimeAndWeather";
import Navigation from "../Components/Navigation";
import { TaskContext } from "../Components/TaskContext";
import {
  clearAllTasks,
  bulkDelete,
  downloadTasksAsJSON,
  importTasksFromJSON,
} from "../Components/TaskHandlers";

const Home = () => {
  const { tasks, updateTasks } = useContext(TaskContext);

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🗓️ Event Planner</h1>
      
      <TimeAndWeather />

      <Navigation />

      <GlobalActionsDropdown
        onClearAll={() => updateTasks(clearAllTasks())}
        onBulkDelete={() => {
          const updated = bulkDelete(tasks);
          updateTasks(updated);
        }}
        onExport={() => downloadTasksAsJSON(tasks)}
        onImport={(e) => importTasksFromJSON(e, updateTasks)}
      />

      <TaskList tasks={tasks} />
*/
import { useEffect, useState } from 'react';
import '../styles/home.css';
import NavBubble from '../components/NavBubble';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bubbles = [
    {
      title: 'Calendar',
      color: 'rgba(20, 20, 20, 0.5)',
      navRoute: '/calendar',
      position: { x: -180, y: 0 },
      size: 250,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 0.8,
    },
    {
      title: 'Add Task',
      color: 'rgba(221, 21, 21, 0.5)',
      navRoute: '/add',
      position: { x: -150, y: 180 },
      size: 200,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 1.0,
    },
    {
      title: 'Edit Task',
      color: 'rgba(82, 124, 216, 0.5)',
      navRoute: '/edit',
      position: { x: 0, y: 45 },
      size: 180,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 0.7,
    },
    {
      title: 'Today',
      color: 'rgba(46, 226, 10, 0.5)',
      navRoute: '/today',
      position: { x: 0, y: 180 },
      size: 160,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 1.1,
    },
    {
      title: 'Spin',
      color: 'rgba(243, 247, 8, 0.5)',
      navRoute: '/spin',
      position: { x: -20, y: 300 },
      size: 120,
      clickable: true,
      origin: { x: -0, y: -210 },
      appearDuration: 0.9,
    },
  ];

  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''}`}> 
      <div className="bubble-wrapper" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div className="bubble-container">
        {bubbles.map((bubble, index) => (
          <NavBubble
            key={index}
            index={index}
            title={bubble.title}
            color={bubble.color}
            navRoute={bubble.navRoute}
            position={bubble.position}
            size={bubble.size}
            zIndex={index + 1}
            clickable={bubble.clickable}
            origin={bubble.origin}
            appearDuration={bubble.appearDuration}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Home;
