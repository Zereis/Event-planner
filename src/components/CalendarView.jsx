import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/calendar.css'; // Import the CSS file for styling

export default function CalendarView() {
  // Example events
  const events = [
    { title: 'Meeting with Bob', date: '2025-05-06T10:00:00' },
    { title: 'Lunch with Sarah', date: '2025-05-07T12:00:00' },
    { title: 'Project Deadline', date: '2025-05-08' },
  ];

  return (
    <div className="calendar-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable={true}
        selectable={true}
        eventClick={(info) => alert(`Event: ${info.event.title}`)}  // Event click handler
      />
    </div>
  );
}
