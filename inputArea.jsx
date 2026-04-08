import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function InputArea({ onSendMessage, disabled }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your symptoms or ask a question..."
          className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none text-gray-700"
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || disabled}
          className={`absolute right-2 p-2 rounded-full transition-colors ${
            inputText.trim() && !disabled 
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      <div className="text-center mt-2">
        <p className="text-[10px] text-gray-400">
          Disclaimer: HealthGuard AI is for informational purposes only.
        </p>
      </div>
    </div>
  );
}