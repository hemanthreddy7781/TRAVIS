// --- START OF REFACTORED FILE src/components/AgentDashboard.tsx ---

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, MessageSquare, User, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConversationHistory } from '../types'; // Import the new type
import axios from 'axios';

const NODE_API_URL = 'http://localhost:8000/api';

export const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logoutUser, token } = useApp();
  
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationHistory | null>(null);

  // Fetch all conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${NODE_API_URL}/conversations`, config);
        setConversations(response.data);
      } catch (err) {
        setError('Failed to fetch conversation history. Please try again later.');
        console.error('Error fetching conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }
  
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Agent Data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-800">
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Monitoring Portal</h1>
              <p className="text-blue-200">Welcome, Agent {user.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel: List of Conversations */}
        <div className="md:col-span-1 bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Customer Conversations ({conversations.length})</h2>
          <div className="space-y-2 max-h-[75vh] overflow-y-auto">
            {conversations.length > 0 ? conversations.map((convo) => (
              <button 
                key={convo._id} 
                onClick={() => setSelectedConversation(convo)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversation?._id === convo._id ? 'bg-purple-600/50' : 'hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">{convo.user.name}</p>
                    <p className="text-xs text-blue-200">{convo.messages.length} messages</p>
                  </div>
                </div>
              </button>
            )) : <p className="text-gray-400 p-3">No customer conversations found.</p>}
          </div>
        </div>

        {/* Right Panel: Selected Conversation Details */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl max-h-[80vh] overflow-y-auto">
          {selectedConversation ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-white">
                  Chat with <span className="text-yellow-400">{selectedConversation.user.name}</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Clock className="w-4 h-4"/>
                  <span>Started: {new Date(selectedConversation.createdAt).toLocaleString()}</span>
                </div>
              </div>
             
              <div className="space-y-4">
                {selectedConversation.messages.map((msg, index) => (
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
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="w-24 h-24 text-gray-500 mb-4" />
              <h2 className="text-2xl font-bold text-white">Select a conversation</h2>
              <p className="text-gray-400 mt-2">Choose a conversation from the left panel to view the detailed chat history.</p>
            </div>
          )}
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </main>
    </div>
  );
};