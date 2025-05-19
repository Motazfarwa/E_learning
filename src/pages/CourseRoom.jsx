// src/pages/CourseRoom.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';

const CourseRoom = () => {
  const { roomId } = useParams();

  return (
    <div>
      <h1>Salle de cours</h1>
      <Chat roomId={roomId} />
    </div>
  );
};

export default CourseRoom;