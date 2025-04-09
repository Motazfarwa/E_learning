import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Meeting = () => {
  const createMeeting = async () => {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const res = await fetch('http://localhost:4000/api/create-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startTime: start,
        endTime: end,
        emails: ['apprenant@email.com', 'expert@email.com']
      })
    });

    const { meetLink } = await res.json();
    window.open(meetLink, '_blank');

    // Fin auto après 15 min
    setTimeout(() => {
      socket.emit('end-meeting');
    }, 15 * 60 * 1000);
  };

  useEffect(() => {
    socket.on('meeting-ended', () => {
      alert('⏰ La réunion est terminée !');
    });
  }, []);

  return (
    <div>
      <h2>Créer une réunion Google Meet</h2>
      <button onClick={createMeeting}>Créer & Rejoindre</button>
    </div>
  );
};

export default Meeting;
