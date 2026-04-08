import React, { useState } from 'react';
import Sidebar from './components/sideBar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import InputArea from './components/inputArea';
import { processInput } from './utils/chatEngine';

export default function App() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I am HealthGuard AI. I can help you with disease information, symptom checking, and finding nearby clinics. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI network delay
    setTimeout(() => {
      const responseText = processInput(userMessage.text);
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (text) => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    handleSendMessage(text);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onQuickAction={handleQuickAction}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-full">
        <ChatHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        <MessageList messages={messages} isTyping={isTyping} />
        <InputArea onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}