import {  useEffect, useState } from "react";
import { io } from "socket.io-client";


const Socket = io("http://localhost:4000");

const ChatComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  
  const UserId = localStorage.getItem('User_id');

  useEffect(() => {
    if (UserId) {
      fetchContacts();
    }
  
    // 🔴 Listen for incoming messages
    Socket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);
    
      if (parseInt(newMessage.receiver_id) === parseInt(UserId)) {
        // Make sure you're tracking unread messages correctly
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.sender_id]: (prev[newMessage.sender_id] || 0) + 1,
        }));
      }
    });
    
    return () => {
      Socket.off("receiveMessage");
    };
  }, [UserId]);
  

  const fetchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/contacts?userId=${UserId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchMessages = async (receiverId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/chat-history?userId=${UserId}&receiverId=${receiverId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const data = await response.json();
      setMessages(data);
  
      // ✅ Reset unread count when opening chat
      setUnreadMessages((prev) => ({
        ...prev,
        [receiverId]: 0,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const handleSelectContact = async (receiverId) => {
    setSelectedReceiver(receiverId);
    await fetchMessages(receiverId);
  };

  const sendMessage = async () => {
    if (!message || !selectedReceiver) return;

    const payload = {
      senderId: UserId,
      receiverId: selectedReceiver,
      message: message,
    };

    try {
      const response = await fetch("http://localhost:4000/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();

      // ✅ Add message to UI instantly
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // ✅ Emit message to Socket.IO server
      Socket.emit("sendMessage", newMessage);

      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      {/* Contacts List */}
      <div className="contacts-list">
  <ul>
    {contacts.map((contact) => (
      <li
        key={contact.id}
        onClick={() => handleSelectContact(contact.id)}
        className={selectedReceiver === contact.id ? "selected" : ""}
      >
        <span className="contact-name">{contact.email}</span>
        <span className="contact-name">{contact.role}</span>

        {/* 🔴 Notification Bubble for unread messages */}
        {unreadMessages[contact.id] && unreadMessages[contact.id] > 0 && (
          <span className="notification-bubble">
            {unreadMessages[contact.id]}
          </span>
        )}
      </li>
    ))}
  </ul>
</div>


      {selectedReceiver && (
        <div className="chat-room">
          <h3>
            Chat with{" "}
            {contacts.find((contact) => contact.id === selectedReceiver)?.email}
          </h3>
          <div className="message-area">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`message ${parseInt(msg.sender_id) === parseInt(UserId) ? "sender" : "receiver"}`}
              >
                {msg.message}
              </p>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
