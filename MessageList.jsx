import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

export default function MessageList({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 shadow-sm ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-teal-600'}`}>
              {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            {/* Message Bubble */}
            <div className={`p-3 rounded-2xl shadow-sm text-sm whitespace-pre-line ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 ml-12 shadow-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1 delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}