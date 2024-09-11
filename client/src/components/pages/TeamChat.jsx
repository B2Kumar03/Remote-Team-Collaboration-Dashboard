import React, { useState, useRef } from 'react';
import { FaUsers, FaComments, FaPaperPlane, FaPlus } from 'react-icons/fa';
import { BsChatText } from 'react-icons/bs';
import { IoMdAttach, IoMdHappy } from 'react-icons/io';

const TeamChat = () => {
  const [selectedGroup, setSelectedGroup] = useState('Group1');
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [fileName, setFileName] = useState('');
  const groups = ['Group1', 'Group2'];
  const privateMessages = ['Private1', 'Private2'];

  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleResizeMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = e.target.parentElement.offsetWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 150 && newWidth < 500) {
        e.target.parentElement.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      // Optionally handle the file here (uploading, previewing, etc.)
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="relative">
        <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
          <div className="text-xl font-semibold mb-4">Groups</div>
          {groups.map((group) => (
            <div
              key={group}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-100 ${group === selectedGroup ? 'bg-blue-200' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              <FaUsers className="text-xl" />
              <span className="font-medium">{group}</span>
            </div>
          ))}
          <div className="text-xl font-semibold mt-4 mb-2">Private</div>
          {privateMessages.map((message) => (
            <div
              key={message}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-100`}
              onClick={() => setSelectedGroup(message)}
            >
              <FaComments className="text-xl" />
              <span className="font-medium">{message}</span>
            </div>
          ))}
        </div>
        {/* Resizable Handle */}
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute top-0 right-0 w-2 bg-gray-300 cursor-col-resize h-full"
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
          <BsChatText className="text-2xl" />
          <span className="text-lg font-semibold">{selectedGroup}</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="flex items-start mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
              <p>Hello everyone!</p>
            </div>
          </div>
          <div className="flex items-start mb-4 justify-end">
            <div className="bg-gray-300 p-3 rounded-lg max-w-xs">
              <p>Hi there!</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t border-gray-300 flex items-center gap-2">
          <IoMdAttach
            className="text-xl cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none"
          />
          {fileName && <span className="text-gray-600">{fileName}</span>}
          <div className="relative">
            <IoMdHappy
              className="text-xl cursor-pointer"
              onClick={() => setShowEmojis(!showEmojis)}
            />
            {showEmojis && (
              <div className="absolute bottom-full right-0 bg-white border border-gray-300 p-2 rounded-lg shadow-lg flex flex-wrap gap-2">
                {['😀', '😂', '😍', '😎'].map((emoji) => (
                  <span
                    key={emoji}
                    className="cursor-pointer text-xl"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-lg flex items-center"
          >
            <FaPaperPlane className="text-lg" />
          </button>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
