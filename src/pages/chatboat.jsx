import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 
const handleSend = async () => {
  if (input.trim() === "") return;

  const userMessage = { sender: "user", text: input };
  setChatHistory((prev) => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const genAI = new GoogleGenerativeAI("AIzaSyB9nkvol6bMMJoymtRCkEh1EdWysNWIQaE");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(input);
    const response = await result.response;
    const botMessage = { sender: "bot", text: response.text() };
    setChatHistory((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error from Gemini API:", error);
    setChatHistory((prev) => [
      ...prev,
      { sender: "bot", text: "Oops! Something went wrong." },
    ]);
  } finally {
    setInput("");
    setIsLoading(false);
  }
};


  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#2563eb",
          color: "white",
          padding: "12px",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          zIndex: 999,
        }}
      >
        💬
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "320px",
            height: "400px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 998,
          }}
        >
          <div
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Assistant
          </div>

          {/* Chat History */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender === "user" ? "#2563eb" : "#f3f4f6",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "75%",
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "75%",
                }}
              >
                Typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "10px",
              display: "flex",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: "8px",
                padding: "8px 12px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatApp;
