import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

export default function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const sender = localStorage.getItem('sender');
  const role = localStorage.getItem('role');
  console.log('role', role);

  useEffect(() => {
    // Fetch existing messages from server
    axios.get('http://localhost:4000/messages')
      .then((res) => setMessages(res.data))
      .catch(console.error);

    // Listen for real-time messages
    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('sendMessage', { sender, content: message, role: role });
      setMessage('');
    }
  };

return (
  <div className="min-h-screen flex flex-col ">
    {/* Navbar */}
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">E_learning Chat Room</div>
      <div className="space-x-6 text-gray-600 font-medium hidden md:flex">
        <button className="hover:text-blue-600 transition">Home</button>
        <button className="hover:text-blue-600 transition">Profile</button>
        <button className="hover:text-blue-600 transition">Settings</button>
      </div>
    </nav>

    {/* Content wrapper */}
    <div className="flex flex-1 max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      {/* Main chat content */}
      <main className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        <h2 className="text-3xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          🧑‍🏫 <span> Chat Room</span>
        </h2>

        <div className="bg-gray-50 flex-1 overflow-y-auto p-5 rounded-lg border border-gray-200 mb-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {messages.map((msg, i) => (
        <div
  key={i}
  className="p-3 bg-white shadow-sm rounded-md border border-gray-200 hover:bg-blue-50 transition-colors"
>
      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
      {new Date(msg.createdAt).toLocaleString()}
     </div>
    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
      {msg.role } 
     </div>
    <strong className="text-blue-600">{msg.sender}:</strong>{" "}
    <span className="text-gray-700">{msg.content}</span>
    </div>

          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </div>
      </main>
    </div>

    {/* Footer */}
    <footer className="bg-white shadow-inner mt-6 py-4 text-center text-gray-500 text-sm">
   
    </footer>
  </div>
);


}
