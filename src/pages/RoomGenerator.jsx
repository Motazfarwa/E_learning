import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function RoomGenerator() {
  const navigate = useNavigate();

  const handleGenerateRoom = () => {
    const roomId = uuidv4();
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Welcome! 👋</h1>
      <button
        onClick={handleGenerateRoom}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Generate Room & Start Chat
      </button>
    </div>
  );
}
