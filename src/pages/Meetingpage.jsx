import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { formatTime, calculateTimeLeft } from '../components/utils/timeUtils';

const MeetingPage = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const [formattedTime, setFormattedTime] = useState('00:00'); // For formatted time (mm:ss)
  const [showAlert, setShowAlert] = useState(false);
  const [alertPlayed, setAlertPlayed] = useState(false); 
  // useNavigate hook for redirection
  const navigate = useNavigate();




  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/meetings/${meetingId}`);
        console.log('API Response:', response.data); // Log API response
        if (!response.data) {
          throw new Error('Meeting not found');
        }
        setMeeting(response.data);
      
      } catch (err) {
        setError(err.message || 'Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };
    
    initializeMeeting();
  }, [meetingId]);
  
  useEffect(() => {
    if (!meeting) return;
  
    console.log('Meeting data:', meeting); // Log the meeting data
  
    const initializeWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
  
        localVideoRef.current.srcObject = stream;
  
        const peer = new Peer();
        peerRef.current = peer;
  
        socketRef.current = io('http://localhost:4000', {
          transports: ['websocket']
        });
  
        peer.on('open', (id) => {
          socketRef.current.emit('join-meeting', { meetingId, peerId: id });
        });
  
        peer.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
  
        socketRef.current.on('user-connected', (peerId) => {
          const call = peer.call(peerId, stream);
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
  
        socketRef.current.on('receive-message', (message) => {
          setMessages(prev => [...prev, { ...message, from: 'other' }]);
        });
  
      } catch (err) {
        console.error('Media device error:', err);
        setError('Failed to access camera/microphone');
      }
    };
  
    initializeWebRTC();
  
    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [meeting, meetingId]);

    const closeMeeting = () => {
    if (peerRef.current) peerRef.current.destroy();
    if (socketRef.current) socketRef.current.disconnect();
  };
  
useEffect(() => {
  const interval = setInterval(() => {
    if (meeting?.endTime) {
      const { hours, minutes, seconds, totalSeconds } = calculateTimeLeft(meeting.endTime);

      console.log('--- Time Calculation ---');
      console.log('Raw endTime:', meeting.endTime);
      console.log('Calculated totalSeconds:', totalSeconds);
      console.log('Formatted Time:', `${hours}:${minutes}:${seconds}`);

      // Update the formatted time
      setFormattedTime(formatTime({ hours, minutes, seconds }));

      // ✅ End meeting only when all are exactly zero
      if (hours === 0 && minutes === 0 && seconds === 0) {
        console.log('🚨 Meeting time expired - navigating away');
        closeMeeting();
        navigate('/home');
        return;
      }

      // 🔔 40-second warning
      if (totalSeconds <= 40 && !alertPlayed) {
        console.log('🔔 40-second warning triggered at:', totalSeconds);
        const utterance = new SpeechSynthesisUtterance(
          `Your meeting is about to end. You have ${totalSeconds} seconds left.`
        );
        speechSynthesis.speak(utterance);
        setAlertPlayed(true);
        setShowAlert(true);
      }
    }
  }, 1000);

  return () => {
    console.log('🧹 Cleaning up time interval');
    clearInterval(interval);
  };
}, [meeting?.endTime, navigate, alertPlayed, closeMeeting]);



  


  const sendMessage = () => {
    if (message.trim() && !meetingEnded) {
      socketRef.current.emit('send-message', {
        meetingId,
        text: message,
        timestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, { 
        text: message, 
        from: 'me', 
        timestamp: new Date() 
      }]);
      setMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">
          Loading meeting details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-red-400 text-2xl max-w-2xl text-center">
          {error} - Please check your meeting ID and try again
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
               {showAlert && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Time Alert!</h2>
            <p className="text-lg mb-4">
              Your meeting is about to end. You have 40 seconds left.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Header Section */}
      <header className="p-4 flex justify-between items-center bg-black/20">
        <h1 className="text-2xl font-bold">
          {meeting?.expert?.name || 'Expert'} ↔ {meeting?.learner?.name || 'Learner'}
        </h1>
        <p>
          Meeting ends at:{" "}
          {new Date(meeting?.endTime).toLocaleString("en-GB", {
            timeZone: "Africa/Tunis",
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
  
        <div className="w-20 h-20">
          <CircularProgressbar
            value={(timeLeft / (meeting?.duration * 60)) * 100} // Time left as a percentage
            text={formattedTime} // Display formatted time (mm:ss)
            styles={{
              path: { stroke: meetingEnded ? '#ef4444' : '#3b82f6' }, // Color change for ended meeting
              trail: { stroke: '#ffffff20' },
              text: { fill: '#fff', fontSize: '1rem' },
            }}
          />
        </div>
      </header>
  
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-160px)]">
        {/* Video Section */}
        <div className="flex-1 flex gap-4">
          {/* Expert Video */}
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden flex-1">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full text-sm">
              You
            </div>
          </div>
  
          {/* Participant Video */}
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden flex-1">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full text-sm">
              {meeting?.expert?.name || 'Participant'}
            </div>
          </div>
        </div>
  
        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
            </svg>
          </button>
        </div>
  
        {/* Chat Section */}
        <div className="flex flex-col gap-4 w-full lg:w-[380px]">
          <div className="bg-black/10 rounded-xl p-4 h-[100%] overflow-y-auto max-h-[400px]">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="text-sm">
                  <div
                    className={`${
                      msg.from === 'me' ? 'text-right' : 'text-left'
                    }`}>
                    <p className={`${msg.from === 'me' ? 'bg-blue-600' : 'bg-gray-700'} inline-block px-4 py-2 rounded-xl`}>
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Message Input */}
          <div className="flex items-center gap-4 mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 bg-gray-700 rounded-xl text-white"
              disabled={meetingEnded}
            />
            <button
              className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
              onClick={sendMessage}
              disabled={meetingEnded}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

 
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
