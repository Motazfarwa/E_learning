// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

// Initialisation du socket avec le token d'authentification
const socket = io('http://localhost:4000', {
  auth: {
    token: localStorage.getItem('token') // Supposons que le token est stocké ici
  }
});

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis le token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({ userId: decoded.userId, role: decoded.role });
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    }

    // Charger les messages historiques
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/chat/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
      }
    };
    fetchMessages();

    // Rejoindre la salle
    socket.emit('joinRoom', { roomId });

    // Écouter les nouveaux messages
    socket.on('message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Gérer les erreurs de connexion
    socket.on('connect_error', (error) => {
      console.error('Erreur de connexion:', error.message);
    });

    // Nettoyage
    return () => {
      socket.off('message');
      socket.off('connect_error');
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      socket.emit('sendMessage', {
        roomId,
        content: message
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === user?.userId ? 'sent' : 'received'} ${
              msg.senderRole === 'instructor' ? 'instructor' : 'student'
            }`}
          >
            <p>
              <strong>{msg.senderRole === 'instructor' ? 'Instructeur' : 'Apprenant'}:</strong> {msg.content}
            </p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tapez votre message..."
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Chat;