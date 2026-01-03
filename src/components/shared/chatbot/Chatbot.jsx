import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiConnector } from "../../../integrations/ApiConnector";
import { chatbotEndpoints } from "../../../integrations/ApiEndpoints";
import "./Chatbot.scss";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm the OpenGiv assistant. How can I help you today?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const renderMessage = (text) => {
    // Split by markdown links: [text](url)
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    
    return parts.map((part, index) => {
      // Check if part is a link
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        let [_, linkText, linkUrl] = linkMatch;
        
        // Safety net: If AI generates example.com or full URL for internal routes, strip it
        if (linkUrl.includes('example.com') || linkUrl.includes('ngoworld.com') || linkUrl.includes('localhost')) {
           try {
             const urlObj = new URL(linkUrl);
             linkUrl = urlObj.pathname + urlObj.search;
           } catch (e) {
             // If invalid URL, just leave it or try to extract path manually
             if (linkUrl.includes('/club/')) {
                linkUrl = '/club/' + linkUrl.split('/club/')[1];
             }
           }
        }

        // Check if internal link (starts with /)
        if (linkUrl.startsWith('/')) {
          return <Link key={index} to={linkUrl} className="chat-link">{linkText}</Link>;
        } else {
          return <a key={index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="chat-link">{linkText}</a>;
        }
      }
      // Return text as is
      return <span key={index}>{part}</span>;
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const generateSessionId = () => {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    let sessionId = localStorage.getItem("chatSessionId");
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem("chatSessionId", sessionId);
    }

    try {
      const response = await apiConnector("POST", chatbotEndpoints.message, {
        message: userMessage.text,
        sessionId: sessionId,
      });

      if (response?.data?.sessionId) {
        localStorage.setItem("chatSessionId", response.data.sessionId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response?.data?.response || "I'm sorry, I didn't understand that.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <FaRobot />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>OpenGiv Assistant</span>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {renderMessage(msg.text)}
              </div>
            ))}
            {isLoading && <div className="loading-dots">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
