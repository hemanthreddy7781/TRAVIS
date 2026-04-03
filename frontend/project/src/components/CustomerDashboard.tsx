// --- START OF REFACTORED FILE CustomerDashboard.tsx ---

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { VoiceButton } from './VoiceButton'; // Assuming VoiceButton is in the same folder

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  // REFACTORED: Get new state and functions from context
  const { user, logoutUser, conversation, sendMessageToBot, isLoading } = useApp();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Handle voice input
  useEffect(() => {
    if (transcript && !isListening) {
      sendMessageToBot(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript, sendMessageToBot]);
  
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessageToBot(inputText.trim());
      setInputText('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!user) {
    // This will be handled by ProtectedRoute, but as a fallback:
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-emerald-800 to-blue-800">
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-emerald-400" />
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
              <p className="text-sm text-blue-200">Welcome, {user.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* REFACTORED: Simple conversation mapping */}
          {conversation.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg px-4 py-3 rounded-2xl shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-700 text-white rounded-bl-none'
              }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-lg px-4 py-3 rounded-2xl shadow-md bg-gray-700 text-white rounded-bl-none">
                <p className="italic">AI is thinking...</p>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <VoiceButton 
            isRecording={isListening}
            onToggleRecording={toggleRecording}
            label={isListening ? "Stop recording" : "Start recording"}
          />
          <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message or use the voice button..."
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              disabled={isLoading || isListening}
            />
            <button type="submit" className="p-3 bg-emerald-600 rounded-xl text-white disabled:bg-gray-500" disabled={isLoading || isListening}>
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};