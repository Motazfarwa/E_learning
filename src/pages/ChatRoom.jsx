import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';


const socket = io('http://localhost:4000');

export default function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const sender = localStorage.getItem('sender');
  const role = localStorage.getItem('role');

  useEffect(() => {
    axios.get('http://localhost:4000/messages')
      .then((res) => setMessages(res.data))
      .catch(console.error);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* Navbar violette */}
      <nav className="bg-gradient-to-r from-purple-700 to-purple-600 shadow-lg px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">Eduki</div>
        
      </nav>

      {/* Contenu principal */}
      <div className="flex flex-1 max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <main className="flex-1 bg-white rounded-2xl shadow-xl p-6 flex flex-col border border-purple-100">
          <h2 className="text-3xl font-semibold text-purple-800 mb-5 flex items-center gap-2">
            <span className="bg-purple-100 p-3 rounded-full">
              🧑‍🏫
            </span>
            <span>Chat Room</span>
          </h2>

          {/* Zone de messages */}
          <div className="bg-purple-50 flex-1 overflow-y-auto p-5 rounded-lg border border-purple-200 mb-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg shadow-sm border ${
                  msg.sender === sender 
                    ? 'bg-purple-600 text-white border-purple-700 ml-auto max-w-md'
                    : 'bg-white border-purple-200 mr-auto max-w-md'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-semibold ${
                    msg.sender === sender ? 'text-purple-200' : 'text-purple-600'
                  }`}>
                    {msg.role} • {msg.sender}
                  </span>
                  <span className={`text-xs ${
                    msg.sender === sender ? 'text-purple-200' : 'text-purple-400'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className={msg.sender === sender ? 'text-white' : 'text-gray-700'}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-md"
            >
              Send
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-purple-50 shadow-inner mt-6 py-4 text-center text-purple-500 text-sm">
        © {new Date().getFullYear()} E-Learning Platform. All rights reserved.
      </footer>
    </div>
  );
}