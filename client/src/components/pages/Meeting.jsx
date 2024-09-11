import React, { useState } from 'react';

const Meeting = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    topic: ''
  });
  const [scheduledMeetings, setScheduledMeetings] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setScheduledMeetings([...scheduledMeetings, formData]);
    alert('Meeting Scheduled Successfully!');
    setFormData({ date: '', time: '', topic: '' });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side: List of Scheduled Meetings */}
      <div className="w-1/3 p-6 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Scheduled Meetings</h2>
        <div className="space-y-4 flex-1">
          {scheduledMeetings.length === 0 ? (
            <p>No meetings scheduled yet.</p>
          ) : (
            scheduledMeetings.map((meeting, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md">
                <p><strong>Date:</strong> {meeting.date}</p>
                <p><strong>Time:</strong> {meeting.time}</p>
                <p><strong>Topic:</strong> {meeting.topic}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side: Schedule Meeting Form */}
      <div className="w-2/3 p-6 mt-56">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Schedule a Meeting</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="time">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="topic">
                Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                value={formData.topic}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            >
              Schedule Meeting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
