import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useDropzone } from 'react-dropzone';
import 'react-calendar/dist/Calendar.css';

const RightSidebar = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [meetingDates, setMeetingDates] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState([]);

  const onDrop = (acceptedFiles) => {
    // Handle file upload here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    // Fetch meeting data from localStorage
    const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const dates = meetings.map(meeting => new Date(meeting.date));
    setMeetingDates(dates);
    setMeetingDetails(meetings);
  }, []);

  const handleMouseOver = (date) => {
    const meeting = meetingDetails.find(meeting => new Date(meeting.date).toDateString() === date.toDateString());
    setHoveredDate(meeting ? { date, ...meeting } : null);
  };

  return (
    <div className="w-64 p-4 bg-gray-100 p-8 shadow-lg">
      {/* Google Calendar Icon */}
      <div
        className="relative"
        onMouseEnter={() => setShowCalendar(true)}
        onMouseLeave={() => setShowCalendar(false)}
      >
        <button className="flex items-center justify-center w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          <span className="text-lg">📅</span> {/* Google Calendar Icon */}
        </button>

        {showCalendar && (
          <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-4 z-10 transition-transform transform scale-105">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ date }) => {
                return meetingDates.some(meetingDate => meetingDate.toDateString() === date.toDateString()) ? 'bg-red-500 text-white' : null;
              }}
              tileContent={({ date, view }) => {
                const meeting = meetingDetails.find(meeting => new Date(meeting.date).toDateString() === date.toDateString());
                return meeting ? <div className="text-center text-white">{meeting.topic}</div> : null;
              }}
              onTileHover={handleMouseOver}
            />
          </div>
        )}
      </div>

      {/* Document Upload */}
      <div className="mt-4">
        <div {...getRootProps({ className: 'dropzone border-dashed border-2 border-gray-400 p-4 rounded-md cursor-pointer' })}>
          <input {...getInputProps()} />
          <p className="text-center text-gray-600">Drag & drop files here, or click to select files</p>
        </div>
      </div>

      {/* Meeting Details Tooltip */}
      {hoveredDate && (
        <div className="absolute top-32 right-0 bg-white shadow-lg rounded-md p-4 z-20">
          <p><strong>Date:</strong> {new Intl.DateTimeFormat('en-US').format(new Date(hoveredDate.date))}</p>
          <p><strong>Time:</strong> {hoveredDate.time}</p>
          <p><strong>Topic:</strong> {hoveredDate.topic}</p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
